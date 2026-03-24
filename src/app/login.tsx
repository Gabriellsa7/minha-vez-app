import { Image, Text, View } from "react-native";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-430 h-932 mb-4"
      />
      <View className="gap-2 items-center">
        <Text className="font-bold text-xl">Bem vindo de volta</Text>
        <Text className="text-sm">Digite seus dados de login abaixo</Text>
      </View>
      <View></View>
      <View></View>
    </View>
  );
}
