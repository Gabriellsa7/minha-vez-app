import { useGetHealthProfessionalByAppointmentId } from "@/src/api/get-health-professional-by-appointment-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
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
      <View className="flex-row items-center gap-4 p-4 bg-bgThird">
        <Pressable onPress={goHome}>
          <ArrowLeft size={26} color={colors.textSecondary} />
        </Pressable>
        <Text className="text-textSecondary text-lg font-bold">
          Consulta Agendada
        </Text>
      </View>

      <View className="flex-1 items-center justify-center gap-6 p-5">
        <View className="w-full items-center gap-3 rounded-2xl border border-borderPrimary bg-bgThird p-6">
          <CheckCircle2 size={48} color={colors.tabActive} />
          <Text className="text-center text-lg font-bold text-textBlack">
            Consulta agendada com sucesso!
          </Text>

          {isLoading ? (
            <ActivityIndicator className="mt-2" color={colors.textSecondary} />
          ) : (
            <View className="mt-2 w-full gap-3">
              {professional && (
                <View className="flex-row items-center gap-2">
                  <Stethoscope size={16} color={colors.textFourth} />
                  <Text className="flex-1 text-sm text-textFourth">
                    {professional.name} - {professional.specialty}
                  </Text>
                </View>
              )}

              {healthUnit && (
                <View className="flex-row items-center gap-2">
                  <MapPin size={16} color={colors.textFourth} />
                  <Text className="flex-1 text-sm text-textFourth">
                    {healthUnit.name} - {healthUnit.address.street},{" "}
                    {healthUnit.address.number} -{" "}
                    {healthUnit.address.neighborhood}
                  </Text>
                </View>
              )}

              {dateTime && (
                <View className="flex-row items-center gap-2">
                  <CalendarClock size={16} color={colors.textFourth} />
                  <Text className="flex-1 text-sm text-textFourth">
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
          className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-bgSecondary py-3.5"
        >
          <Text className="text-base font-semibold text-textPrimary">
            Ir para o início
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
