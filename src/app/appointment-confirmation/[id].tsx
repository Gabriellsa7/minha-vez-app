import { useGetHealthProfessionalByAppointmentId } from "@/src/api/get-health-professional-by-appointment-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarClock,
  CheckCircle2,
  MapPin,
  Stethoscope,
} from "lucide-react-native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppointmentConfirmationScreen() {
  const colors = useThemeColors();
  const { id, dateTime } = useLocalSearchParams<{
    id: string;
    dateTime?: string;
  }>();

  const { data: professional, isLoading: isProfessionalLoading } =
    useGetHealthProfessionalByAppointmentId(
      { appointmentId: id ?? "" },
      { enabled: Boolean(id) },
    );

  const { data: healthUnit, isLoading: isHealthUnitLoading } =
    useGetHealthUnitById(
      { healthUnitId: professional?.healthUnitId ?? "" },
      { enabled: Boolean(professional?.healthUnitId) },
    );

  const isLoading = isProfessionalLoading || isHealthUnitLoading;

  const goHome = () => router.replace("/home");

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <LinearGradient
        colors={[colors.bgFourth, colors.bgSecondary]}
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 24,
          gap: 20,
        }}
      >
        <View className="w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-5">
          <View className="items-center justify-center rounded-full bg-white/15 p-3">
            <CheckCircle2 size={22} color={colors.textPrimary} />
          </View>
          <Text className="text-textPrimary font-semibold text-base text-center">
            Consulta agendada com sucesso!
          </Text>

          {isLoading ? (
            <ActivityIndicator className="mt-2" color={colors.textPrimary} />
          ) : (
            <View className="mt-2 w-full gap-3">
              {professional && (
                <View className="flex-row items-center gap-2">
                  <Stethoscope size={16} color={colors.textPrimary} />
                  <Text className="flex-1 text-sm text-textPrimary opacity-70">
                    {professional.name} - {professional.specialty}
                  </Text>
                </View>
              )}

              {healthUnit && (
                <View className="flex-row items-center gap-2">
                  <MapPin size={16} color={colors.textPrimary} />
                  <Text className="flex-1 text-sm text-textPrimary opacity-70">
                    {healthUnit.name} - {healthUnit.address.street},{" "}
                    {healthUnit.address.number} -{" "}
                    {healthUnit.address.neighborhood}
                  </Text>
                </View>
              )}

              {dateTime && (
                <View className="flex-row items-center gap-2">
                  <CalendarClock size={16} color={colors.textPrimary} />
                  <Text className="flex-1 text-sm text-textPrimary opacity-70">
                    {formatDateTime(dateTime)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={goHome}
          className="mt-1 w-full items-center rounded-full bg-white px-5 py-3"
        >
          <Text className="text-bgSecondary font-semibold text-sm">
            Ir para o início
          </Text>
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
}
