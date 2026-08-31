import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetPrescriptionsByPatientId } from "@/src/api/get-prescriptions-by-patient-id";
import { useGetUser } from "@/src/api/get-user-me";
import Header from "@/src/components/header/header";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarClock,
  CalendarPlus,
  FileText,
  MapPin,
  Stethoscope,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrescriptionDetailScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const {
    data: prescriptions,
    isLoading,
    isError,
    refetch,
  } = useGetPrescriptionsByPatientId(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const prescription = prescriptions?.find((item) => item._id === id);
  const isLoadingPrescription = isLoading && Boolean(patient?._id);

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Detalhes da Receita" />

      <View className="flex-1 px-4 pt-4">
        {isLoadingPrescription ? (
          <HistorySkeleton />
        ) : isError || !prescription ? (
          <View className="flex-1 items-center justify-center gap-3">
            <Text className="text-center text-textFifth">
              Não foi possível carregar esta receita.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => refetch()}
              className="flex-row items-center gap-2 rounded-lg bg-bgSecondary px-4 py-3"
            >
              <Text className="font-bold text-textPrimary">
                Tentar novamente
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="rounded-2xl border border-borderPrimary bg-bgThird p-4">
              <View className="flex-row items-center gap-2">
                <CalendarClock size={16} color={colors.textFourth} />
                <Text className="text-sm text-textFourth">
                  {new Date(prescription.createdAt).toLocaleDateString(
                    "pt-BR",
                  )}
                </Text>
              </View>

              <View className="mt-3 flex-row items-center gap-2">
                <Stethoscope size={16} color={colors.textFourth} />
                <Text className="text-sm text-textFourth">
                  {prescription.professionalName}
                </Text>
              </View>

              <View className="mt-2 flex-row items-center gap-2">
                <MapPin size={16} color={colors.textFourth} />
                <Text className="text-sm text-textFourth">
                  {prescription.healthUnitName}
                </Text>
              </View>

              {prescription.medications && (
                <View className="mt-4">
                  <Text className="text-xs font-semibold text-textFifth">
                    Medicamentos
                  </Text>
                  <Text className="mt-1 text-sm text-textBlack">
                    {prescription.medications}
                  </Text>
                </View>
              )}

              {prescription.observations && (
                <View className="mt-4">
                  <Text className="text-xs font-semibold text-textFifth">
                    Observações
                  </Text>
                  <Text className="mt-1 text-sm text-textBlack">
                    {prescription.observations}
                  </Text>
                </View>
              )}
            </View>

            <Text className="mb-2 mt-4 text-sm font-semibold text-textBlack">
              Exames
            </Text>

            {prescription.exams.map((exam, index) => (
              <View
                key={`${exam.examOfferingId}-${index}`}
                className="mb-3 gap-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
              >
                <View className="flex-row items-center gap-2">
                  <FileText size={16} color={colors.textFourth} />
                  <Text className="flex-1 text-sm font-semibold text-textBlack">
                    {exam.examOfferingName}
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      `/exam-scheduling/${prescription.healthUnitId}/${exam.examOfferingId}`,
                    )
                  }
                  className="flex-row items-center justify-center gap-2 rounded-xl bg-bgSecondary py-2.5"
                >
                  <CalendarPlus size={16} color={colors.textPrimary} />
                  <Text className="text-sm font-semibold text-textPrimary">
                    Marcar exame
                  </Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
