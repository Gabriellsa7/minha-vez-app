import Header from "@/src/components/header/header";
import { MedicalInfo } from "@/src/features/medical-info/medical-info";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicalInfoPage() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Informações de Saúde" />
      <MedicalInfo />
    </SafeAreaView>
  );
}
