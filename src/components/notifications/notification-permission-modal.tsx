import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Bell } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NotificationPermissionModalProps {
  visible: boolean;
  canAskAgain: boolean;
  onAllow: () => void;
  onDismiss: () => void;
}

export function NotificationPermissionModal({
  visible,
  canAskAgain,
  onAllow,
  onDismiss,
}: NotificationPermissionModalProps) {
  const colors = useThemeColors();
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <SafeAreaView className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full items-center gap-4 rounded-2xl bg-bgThird p-6">
          <View className="items-center justify-center rounded-full bg-infoBg p-4">
            <Bell size={28} color={colors.textSecondary} />
          </View>
          <Text className="text-center text-lg font-bold text-textBlack">
            Ative as notificações
          </Text>
          <Text className="text-center text-sm text-textFifth">
            Precisamos da sua permissão para avisar quando sua vez estiver
            chegando e lembrar você das suas consultas.
          </Text>
          <View className="mt-2 w-full gap-2">
            <Pressable
              accessibilityRole="button"
              onPress={onAllow}
              className="items-center rounded-xl bg-button-primary py-3"
            >
              <Text className="font-bold text-textPrimary">
                {canAskAgain ? "Permitir notificações" : "Abrir configurações"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onDismiss}
              className="items-center py-3"
            >
              <Text className="font-semibold text-textFifth">Agora não</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
