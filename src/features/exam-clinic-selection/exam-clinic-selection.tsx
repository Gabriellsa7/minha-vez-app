import { useGetClinicsOfferingExam } from "@/src/api/get-clinics-offering-exam";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router } from "expo-router";
import { FlaskConical } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { ExamClinicOfferingCard } from "./components/exam-clinic-offering-card/exam-clinic-offering-card";

interface ExamClinicSelectionProps {
  examName: string;
}

export function ExamClinicSelection({ examName }: ExamClinicSelectionProps) {
  const colors = useThemeColors();
  const hasAutoRedirected = useRef(false);

  const {
    data: offerings,
    isLoading,
    isError,
    refetch,
  } = useGetClinicsOfferingExam(
    { examName },
    { enabled: Boolean(examName) },
  );

  useEffect(() => {
    if (hasAutoRedirected.current) return;
    if (!offerings || offerings.length !== 1) return;

    hasAutoRedirected.current = true;
    const offering = offerings[0];
    router.replace(`/exam-scheduling/${offering.healthUnitId}/${offering._id}`);
  }, [offerings]);

  if (isLoading || (offerings && offerings.length === 1)) {
    return (
      <View className="flex-1 items-center justify-center bg-bgPrimary">
        <ActivityIndicator color={colors.textSecondary} />
        <Text className="mt-3 text-sm text-textFourth">
          Buscando clínicas com este exame...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-bgPrimary p-4">
        <Text className="text-center text-textFifth">
          Não foi possível carregar as clínicas para este exame.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => refetch()}
          className="flex-row items-center gap-2 rounded-lg bg-bgSecondary px-4 py-3"
        >
          <Text className="font-bold text-textPrimary">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (!offerings || offerings.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-bgPrimary p-8">
        <FlaskConical size={28} color={colors.tabActive} />
        <Text className="mt-3 text-center text-textFifth">
          Nenhuma clínica está oferecendo este exame no momento.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-bgPrimary" showsVerticalScrollIndicator={false}>
      <View className="gap-3 p-5">
        <Text className="text-sm text-textFourth">
          Este exame é oferecido em {offerings.length} clínicas. Escolha onde
          deseja agendar.
        </Text>
        {offerings.map((offering) => (
          <ExamClinicOfferingCard key={offering._id} offering={offering} />
        ))}
      </View>
    </ScrollView>
  );
}
