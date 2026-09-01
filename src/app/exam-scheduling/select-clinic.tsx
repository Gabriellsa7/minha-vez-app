import Header from "@/src/components/header/header";
import { ExamClinicSelection } from "@/src/features/exam-clinic-selection/exam-clinic-selection";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectExamClinicScreen() {
  const { examName } = useLocalSearchParams<{ examName: string }>();

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Escolher Clínica" />
      <ExamClinicSelection examName={examName ?? ""} />
    </SafeAreaView>
  );
}
