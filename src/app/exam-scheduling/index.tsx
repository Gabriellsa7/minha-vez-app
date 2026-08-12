import Header from "@/src/components/header/header";
import { ExamSchedulingList } from "@/src/features/exam-scheduling-list/exam-scheduling-list";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExamSchedulingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Agendar Exame" />
      <ExamSchedulingList />
    </SafeAreaView>
  );
}
