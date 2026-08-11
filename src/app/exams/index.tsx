import { useGetExamsByPatientId } from "@/src/api/get-exams-by-patient-id";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import Header from "@/src/components/header/header";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import { router } from "expo-router";
import {
  CalendarClock,
  FileText,
  MapPin,
  Stethoscope,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExamsScreen() {
  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const {
    data: exams,
    isLoading: isExamsLoading,
    isError,
    refetch,
  } = useGetExamsByPatientId(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const isLoading = isExamsLoading && Boolean(patient?._id);

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Meus Exames" />

      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <HistorySkeleton />
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-3">
            <Text className="text-center text-textFifth">
              Não foi possível carregar seus exames.
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
            {!exams || exams.length === 0 ? (
              <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
                <FileText size={28} color="#0F766E" />
                <Text className="mt-3 text-center text-textFifth">
                  Você ainda não possui exames disponíveis.
                </Text>
              </View>
            ) : (
              exams.map((exam) => (
                <Pressable
                  key={exam._id}
                  accessibilityRole="button"
                  onPress={() => router.push(`/exams/${exam._id}`)}
                  className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
                >
                  <Text className="text-base font-semibold text-textBlack">
                    {exam.examType}
                  </Text>

                  {exam.examDate && (
                    <View className="mt-3 flex-row items-center gap-2">
                      <CalendarClock size={14} color="#A8A8A8" />
                      <Text className="text-xs text-textFourth">
                        {new Date(exam.examDate).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                  )}

                  {exam.doctorName && (
                    <View className="mt-1 flex-row items-center gap-2">
                      <Stethoscope size={14} color="#A8A8A8" />
                      <Text className="text-xs text-textFourth" numberOfLines={1}>
                        {exam.doctorName}
                      </Text>
                    </View>
                  )}

                  {exam.healthUnitName && (
                    <View className="mt-1 flex-row items-center gap-2">
                      <MapPin size={14} color="#A8A8A8" />
                      <Text className="text-xs text-textFourth" numberOfLines={1}>
                        {exam.healthUnitName}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
