import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { AlertTriangle, X } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

interface QueueClosedModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  onFindAnotherDoctor?: () => void;
}

export function QueueClosedModal({
  visible,
  message,
  onClose,
  onFindAnotherDoctor,
}: QueueClosedModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <View className="w-full rounded-2xl bg-bgThird">
          <View className="flex-row items-center justify-between border-b border-borderPrimary px-5 py-4">
            <Text className="text-lg font-bold text-textBlack">
              Fila encerrada
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={8}
              onPress={onClose}
            >
              <X size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View className="gap-4 px-5 py-5">
            <View className="flex-row items-start gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-warningBg">
                <AlertTriangle size={20} color={colors.warningText} />
              </View>
              <Text className="flex-1 text-base text-textFifth">
                {message}
              </Text>
            </View>

            {onFindAnotherDoctor && (
              <Pressable
                accessibilityRole="button"
                onPress={onFindAnotherDoctor}
                className="items-center rounded-xl bg-bgSecondary py-3"
              >
                <Text className="font-bold text-textPrimary">
                  Buscar outro médico
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
