import Header from "@/src/components/header/header";
import HealthUnitInfo from "@/src/features/health-unit-info/health-unit-info";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HealthUnitInfoPage() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Informações da Unidade de Saúde" />
      <HealthUnitInfo />
    </SafeAreaView>
  );
}
