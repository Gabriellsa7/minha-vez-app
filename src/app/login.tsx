import { Image, Text, View } from "react-native";
import { LoginForm } from "../features/login-form/login-form";

export default function Login() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-bgPrimary">
      <Image
        source={require("@/assets/images/logo.png")}
        className="w-430 h-932 mb-4"
      />
      <View className="gap-2 items-center">
        <Text className="font-bold text-xl text-textBlack">Bem vindo de volta</Text>
        <Text className="text-sm text-textFifth">Digite seus dados abaixo</Text>
      </View>
      <LoginForm />
    </View>
  );
}
