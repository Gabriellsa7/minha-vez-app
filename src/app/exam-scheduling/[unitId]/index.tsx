import Header from "@/src/components/header/header";
import { ExamSchedulingOfferings } from "@/src/features/exam-scheduling-offerings/exam-scheduling-offerings";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExamSchedulingOfferingsScreen() {
  const { unitId } = useLocalSearchParams<{ unitId: string }>();

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Exames da Clínica" />
      <ExamSchedulingOfferings healthUnitId={unitId ?? ""} />
    </SafeAreaView>
  );
}
