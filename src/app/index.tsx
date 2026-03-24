import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-5">
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-430 h-932 mb-4"
      />
      <View className="items-center gap-2">
        <Text className="font-bold text-xl">Bem vindo a minha vez</Text>
        <Text className="text-sm">seu app de gestão de consultas</Text>
      </View>
      <View className="gap-4 w-[80%]">
        <TouchableOpacity
          className="bg-button-primary py-3 px-2 rounded-xl items-center"
          onPress={() => router.push("/login")}
        >
          <Text className="text-textPrimary">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-button-primary py-3 px-2 rounded-xl items-center"
          onPress={() => router.push("/signup")}
        >
          <Text className="text-textPrimary">Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
