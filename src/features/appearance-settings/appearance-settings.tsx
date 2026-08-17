import { Check, Moon, Smartphone, Sun } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useThemePreference } from "@/src/hooks/use-theme-preference";
import { ThemePreference } from "@/src/services/theme/theme-preference.storage";

const OPTIONS: {
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    value: "auto",
    label: "Automático",
    description: "Segue o tema definido nas configurações do seu celular",
    icon: Smartphone,
  },
  {
    value: "light",
    label: "Claro",
    description: "Sempre usar o tema claro",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Sempre usar o tema escuro",
    icon: Moon,
  },
];

export function AppearanceSettings() {
  const colors = useThemeColors();
  const { preference, selectPreference } = useThemePreference();

  return (
    <View className="p-6 gap-4">
      <View className="gap-3 rounded-2xl bg-bgThird p-4">
        {OPTIONS.map((option, index) => {
          const selected = preference === option.value;
          const Icon = option.icon;

          return (
            <Pressable
              key={option.value}
              onPress={() => selectPreference(option.value)}
              className={`flex-row items-center gap-4 py-2 ${
                index > 0 ? "border-t border-borderPrimary pt-4" : ""
              }`}
            >
              <Icon size={24} color={colors.textSecondary} />
              <View className="flex-1">
                <Text className="text-textBlack font-bold">
                  {option.label}
                </Text>
                <Text className="text-textFourth text-sm">
                  {option.description}
                </Text>
              </View>
              {selected && <Check size={20} color={colors.textSecondary} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
