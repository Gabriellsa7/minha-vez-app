import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Image, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StatusScreenProps = {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
};

export function StatusScreen({
  title,
  message,
  actionLabel,
  onAction,
}: StatusScreenProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-bgPrimary px-8">
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-32 h-32 mb-2"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-textBlack text-center">
        {title}
      </Text>
      <Text className="text-sm text-textFifth text-center">{message}</Text>
      <Pressable
        onPress={onAction}
        className="mt-4 rounded-full px-6 py-3"
        style={{ backgroundColor: colors.buttonPrimary }}
      >
        <Text className="font-bold" style={{ color: colors.textPrimary }}>
          {actionLabel}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
