import Header from "@/src/components/header/header";
import { AppearanceSettings } from "@/src/features/appearance-settings/appearance-settings";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppearancePage() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Aparência" />
      <AppearanceSettings />
    </SafeAreaView>
  );
}
