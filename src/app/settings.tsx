import Header from "@/src/components/header/header";
import { Settings } from "@/src/features/settings/settings";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsPage() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Configurações" />
      <Settings />
    </SafeAreaView>
  );
}
