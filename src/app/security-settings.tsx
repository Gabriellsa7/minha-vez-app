import Header from "@/src/components/header/header";
import { SecuritySettings } from "@/src/features/security-settings/security-settings";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecuritySettingsPage() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Configurações de Segurança" />
      <SecuritySettings />
    </SafeAreaView>
  );
}
