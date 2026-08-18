import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Href, useRouter } from "expo-router";
import {
  ArrowRight,
  Edit,
  FileHeart,
  HeartPulse,
  Lock,
  Moon,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

const SETTINGS_ITEMS = [
  { label: "Editar Perfil", icon: Edit, href: "/edit-profile" },
  {
    label: "Prioridade de Atendimento",
    icon: HeartPulse,
    href: "/priority-info",
  },
  { label: "Informações de Saúde", icon: FileHeart, href: "/medical-info" },
  {
    label: "Configurações de Segurança",
    icon: Lock,
    href: "/security-settings",
  },
  { label: "Aparência", icon: Moon, href: "/appearance" },
] as const;

export const Settings = () => {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-bgPrimary"
      contentContainerStyle={{ padding: 24, gap: 16 }}
    >
      {SETTINGS_ITEMS.map(({ label, icon: Icon, href }) => (
        <Pressable
          key={href}
          onPress={() => router.push(href as Href)}
          className="flex-row justify-between items-center bg-bgThird p-4 rounded-xl"
        >
          <View className="flex-row items-center gap-4">
            <Icon size={24} color={colors.textSecondary} />
            <Text className="text-textBlack">{label}</Text>
          </View>
          <ArrowRight size={24} color={colors.textFourth} />
        </Pressable>
      ))}
    </ScrollView>
  );
};
