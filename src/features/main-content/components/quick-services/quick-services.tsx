import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useThemeColors } from "@/src/hooks/use-theme-colors";

import { QUICK_SERVICES } from "./quick-services.constants";

export function QuickServices() {
  const colors = useThemeColors();

  return (
    <View className="gap-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-textBlack">Serviços Rapidos</Text>
        <Pressable onPress={() => router.push("/quick-services")}>
          <Text className="text-sm text-textThird">Ver todos</Text>
        </Pressable>
      </View>
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
