import Header from "@/src/components/header/header";
import { EditProfile } from "@/src/features/edit-profile/edit-profile";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfilePage() {
  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Editar Perfil" />
      <EditProfile />
    </SafeAreaView>
  );
}
