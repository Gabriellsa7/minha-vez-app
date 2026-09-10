import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react-native";
import { ComponentType } from "react";
import { Pressable, Text, View } from "react-native";
import { ToastConfigParams } from "react-native-toast-message";

interface ToastCardProps extends ToastConfigParams<unknown> {
  bg: string;
  border: string;
  accent: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
}

// Custom cards for react-native-toast-message: the library's default
// BaseToast clips text1/text2 to a single line each (unreadable for longer
// backend error messages) and has no close affordance beyond a swipe
// gesture. This renders the full message and an explicit, padded close
// button instead.
function ToastCard({ text1, text2, hide, bg, border, accent, Icon }: ToastCardProps) {
  return (
    <View
      className="mx-4 w-[92%] flex-row items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <Icon size={20} color={accent} />
      <View className="flex-1 gap-0.5">
        {!!text1 && (
          <Text
            style={{ color: accent }}
            className="text-sm font-semibold"
            numberOfLines={2}
          >
            {text1}
          </Text>
        )}
        {!!text2 && (
          <Text style={{ color: accent }} className="text-sm" numberOfLines={4}>
            {text2}
          </Text>
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        hitSlop={10}
        onPress={() => hide()}
        className="-mr-1 -mt-1 rounded-full p-2"
      >
        <X size={16} color={accent} />
      </Pressable>
    </View>
  );
}

export function useToastConfig() {
  const colors = useThemeColors();

  return {
    success: (props: ToastConfigParams<unknown>) => (
      <ToastCard
        {...props}
        bg={colors.statusSuccessBg}
        border={colors.statusSuccessBg}
        accent={colors.statusSuccessText}
        Icon={CheckCircle2}
      />
    ),
    error: (props: ToastConfigParams<unknown>) => (
      <ToastCard
        {...props}
        bg={colors.statusDangerBg}
        border={colors.statusDangerBg}
        accent={colors.statusDangerText}
        Icon={AlertCircle}
      />
    ),
    info: (props: ToastConfigParams<unknown>) => (
      <ToastCard
        {...props}
        bg={colors.infoBg}
        border={colors.infoBorder}
        accent={colors.highlightText}
        Icon={Info}
      />
    ),
  };
}
