import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LoginForm } from "../features/login-form/login-form";

export default function Login() {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bgPrimary"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center gap-4 bg-bgPrimary py-8">
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-430 h-932 mb-4"
          />
          <View className="gap-2 items-center">
            <Text className="font-bold text-xl text-textBlack">
              Bem vindo de volta
            </Text>
            <Text className="text-sm text-textFifth">
              Digite seus dados abaixo
            </Text>
          </View>
          <LoginForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
