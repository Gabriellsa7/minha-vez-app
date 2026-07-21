import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { LOGIN_FORM_SCHEMA } from "./entities/login-form.constants";
import { LoginFormSchema } from "./entities/login-form.types";

import { useLogin } from "@/src/hooks/useLogin";
import { useState } from "react";

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
  });

  const email = watch("email");
  const password = watch("password");

  const [isChecked, setChecked] = useState(false);

  const { mutate: loginUser } = useLogin();

  const onSubmit = (data: LoginFormSchema) => {
    loginUser(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.replace("/home");
        },
      },
    );
  };

  return (
    <View className="gap-6 items-center w-full">
      <View className="w-[80%] gap-3">
        <Text>
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
              onChangeText={onChange}
              className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500">{errors.email.message}</Text>
        )}
      </View>
      <View className="w-[80%] gap-3">
        <View className="flex-row justify-between">
          <Text>
            Senha <Text className="text-textDanger">*</Text>
          </Text>
          <Text className="text-textSecondary text-xs">Esqueceu a senha</Text>
        </View>
        {/* Add logic to show user password when he is writing */}
        <View className="gap-5">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Digite sua senha..."
                value={value}
                onChangeText={onChange}
                secureTextEntry={true}
                className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0"
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500">{errors.password.message}</Text>
          )}
        </View>
      </View>
      <View className="w-[80%] gap-2">
        <TouchableOpacity
          className="bg-button-primary py-3 px-2 rounded-xl items-center"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-textPrimary">Entrar</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text onPress={() => router.push("/signup")}>
            Ainda não tem uma conta?{" "}
            <Text className="text-textSecondary underline">Crie Agora</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
