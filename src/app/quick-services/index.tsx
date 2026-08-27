import Header from "@/src/components/header/header";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QUICK_SERVICES } from "@/src/features/main-content/componentes/quick-services/quick-services.constants";

export default function QuickServicesPage() {
  const colors = useThemeColors();

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Serviços Rápidos" />
      <FlatList
        data={QUICK_SERVICES}
        keyExtractor={(item) => item.key}
        numColumns={4}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={{ gap: 16, padding: 20 }}
        renderItem={({ item: { label, icon: Icon, onPress } }) => (
          <View className="flex-1 items-center gap-2">
            <Pressable onPress={onPress}>
              <View className="rounded-lg p-6 bg-bgThird">
                <Icon size={20} color={colors.textSecondary} />
              </View>
            </Pressable>
            <Text className="text-center text-xs text-textBlack" numberOfLines={2}>
              {label}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
