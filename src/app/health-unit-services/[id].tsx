import Header from "@/src/components/header/header";
import { HealthUnitServices } from "@/src/features/health-unit-services/health-unit-services";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HealthUnitServicesPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Serviços Oferecidos" />
      <HealthUnitServices healthUnitId={id ?? ""} />
    </SafeAreaView>
  );
}
