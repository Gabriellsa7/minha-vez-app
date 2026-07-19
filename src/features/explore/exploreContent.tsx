import Header from "@/src/components/header/header";
import { Text, View } from "react-native";

export function ExploreContent() {
  return (
    <View>
      <Header text="Explorar" />
      <View className="p-6">
        <Text className="text-textSecondary text-lg">
          Encontre o cuidado que você merece.
        </Text>
      </View>
    </View>
  );
}
