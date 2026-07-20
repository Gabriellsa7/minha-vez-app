import { ProfileContent } from "@/src/features/profile-content/profile-content";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfileContent />
    </SafeAreaView>
  );
}
