import { useGetExamOfferingsByHealthUnitId } from "@/src/api/get-exam-offerings-by-health-unit-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { FlaskConical, MapPin } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { ExamOfferingCard } from "./components/exam-offering-card/exam-offering-card";

interface ExamSchedulingOfferingsProps {
  healthUnitId: string;
}

export function ExamSchedulingOfferings({
  healthUnitId,
}: ExamSchedulingOfferingsProps) {
  const colors = useThemeColors();
  const { data: healthUnit } = useGetHealthUnitById({ healthUnitId });
  const { data: offerings, isLoading } = useGetExamOfferingsByHealthUnitId({
    healthUnitId,
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-bgPrimary">
      <View className="gap-5 p-5">
        <View className="rounded-2xl border border-borderPrimary bg-bgThird p-4">
          <Text className="text-lg font-bold text-textBlack">
            {healthUnit?.name}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={12} color={colors.textFourth} />
            <Text className="flex-1 text-xs text-textFourth" numberOfLines={1}>
              {healthUnit?.address.street}, {healthUnit?.address.number} -{" "}
              {healthUnit?.address.neighborhood}
            </Text>
          </View>
        </View>

        <Text className="text-base font-semibold text-textBlack">
          Exames disponíveis
        </Text>

        {isLoading ? (
          <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
            <Text className="text-sm text-textFourth">
              Carregando exames...
            </Text>
          </View>
        ) : !offerings || offerings.length === 0 ? (
          <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
            <FlaskConical size={28} color={colors.tabActive} />
            <Text className="mt-3 text-center text-textFifth">
              Esta clínica ainda não oferece exames para agendamento.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {offerings.map((offering) => (
              <ExamOfferingCard
                key={offering._id}
                offering={offering}
                healthUnitId={healthUnitId}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
