import { Image, Text, View } from "react-native";
import { SignupForm } from "../features/signup-form/signup-form";

export default function Signup() {
  return (
    <View className="flex-1 items-center justify-center gap-6">
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-430 h-932 mb-4"
      />
      <View className="gap-2 items-center">
        <Text className="font-bold text-xl">Bem vindo</Text>
        <Text className="text-sm">Digite seus dados de login abaixo</Text>
      </View>
      <SignupForm />
    </View>
  );
}
