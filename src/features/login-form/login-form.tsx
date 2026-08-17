import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { LOGIN_FORM_SCHEMA } from "./entities/login-form.constants";
import { LoginFormSchema } from "./entities/login-form.types";

import { PasswordInput } from "@/src/components/password-input/password-input";
import { ForgotPasswordModal } from "@/src/features/forgot-password/forgot-password-modal";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useLogin } from "@/src/hooks/useLogin";
import { NotificationService } from "@/src/services/notifications/notification.service";

export function LoginForm() {
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const colors = useThemeColors();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
  });

  const { mutate: loginUser } = useLogin();

  const onSubmit = (data: LoginFormSchema) => {
    loginUser(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.replace("/home");
          void NotificationService.registerForPushNotifications();
        },
      },
    );
  };

  return (
    <View className="gap-6 items-center w-full">
      <View className="w-[80%] gap-3">
        <Text className="text-textBlack">
          Email <Text className="text-textDanger">*</Text>
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Digite seu email"
              value={value}
              inputMode="email"
              placeholderTextColor={colors.textFourth}
              onChangeText={onChange}
              className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0 text-textBlack"
            />
          )}
        />
        {errors.email && (
          <Text className="text-textDanger">{errors.email.message}</Text>
        )}
      </View>
      <View className="w-[80%] gap-3">
        <View className="flex-row justify-between">
          <Text className="text-textBlack">
            Senha <Text className="text-textDanger">*</Text>
          </Text>
          <Text
            className="text-textSecondary text-xs"
            onPress={() => setIsForgotPasswordVisible(true)}
          >
            Esqueceu a senha
          </Text>
        </View>
        <View className="gap-5">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <PasswordInput value={value} onChangeText={onChange} />
            )}
          />
          {errors.password && (
            <Text className="text-textDanger">{errors.password.message}</Text>
          )}
        </View>
      </View>
      <View className="w-[80%] gap-5">
        <TouchableOpacity
          className="bg-button-primary py-3 px-2 rounded-xl items-center"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-textPrimary">Entrar</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text
            className="text-textBlack"
            onPress={() => router.push("/signup")}
          >
            Ainda não tem uma conta?{" "}
            <Text className="text-textSecondary underline">Crie Agora</Text>
          </Text>
        </View>
      </View>
      <ForgotPasswordModal
        visible={isForgotPasswordVisible}
        onClose={() => setIsForgotPasswordVisible(false)}
      />
    </View>
  );
}
