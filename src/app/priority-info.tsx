import Header from "@/src/components/header/header";
import { PriorityInfo } from "@/src/features/priority-info/priority-info";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PriorityInfoPage() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Prioridade de Atendimento" />
      <PriorityInfo />
    </SafeAreaView>
  );
}
