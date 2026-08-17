import { router } from "expo-router";
import {
  Calendar,
  Compass,
  FileText,
  History,
  TestTube,
} from "lucide-react-native";
import type { ComponentType } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useThemeColors } from "@/src/hooks/use-theme-colors";

interface QuickServiceItem {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
}

const QUICK_SERVICES: QuickServiceItem[] = [
  {
    key: "agendar",
    label: "Agendar",
    icon: Calendar,
    onPress: () => router.push("/agenda"),
  },
  {
    key: "agendar-exame",
    label: "Agendar Exame",
    icon: TestTube,
    onPress: () => router.push("/exam-scheduling"),
  },
  {
    key: "historico",
    label: "Histórico",
    icon: History,
    onPress: () => router.push("/history"),
  },
  {
    key: "explorar",
    label: "Explorar",
    icon: Compass,
    onPress: () => router.push("/explore"),
  },
  {
    key: "meus-exames",
    label: "Meus Exames",
    icon: FileText,
    onPress: () => router.push("/exams"),
  },
];

export function QuickServices() {
  const colors = useThemeColors();

  return (
    <View className="gap-5">
      <Text className="text-textBlack">Serviços Rapidos</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingRight: 8 }}
      >
        {QUICK_SERVICES.map(({ key, label, icon: Icon, onPress }) => (
          <View key={key} className="w-20 items-center gap-2">
            <Pressable onPress={onPress}>
              <View className="rounded-lg p-6 bg-bgThird">
                <Icon size={20} color={colors.textSecondary} />
              </View>
            </Pressable>
            <Text className="text-center text-xs text-textBlack" numberOfLines={2}>
              {label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
