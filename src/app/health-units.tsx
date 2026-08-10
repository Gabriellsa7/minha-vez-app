import Header from "@/src/components/header/header";
import { HealthUnitsList } from "@/src/features/health-units-list/health-units-list";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HealthUnitsPage() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Clínicas" />
      <HealthUnitsList />
    </SafeAreaView>
  );
}
