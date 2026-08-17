import { PasswordInput } from "@/src/components/password-input/password-input";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useSignup } from "@/src/hooks/useSignup";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SIGNUP_FORM_SCHEMA } from "./entities/signup-form.constants";
import { SignupFormSchema } from "./entities/signup-form.types";

export function SignupForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormSchema>({ resolver: zodResolver(SIGNUP_FORM_SCHEMA) });

  const { mutate: createUser } = useSignup();
  const colors = useThemeColors();

  const onSubmit = (data: SignupFormSchema) => {
    createUser(
      { name: data.name, email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.replace("/login");
        },
      },
    );
  };

  return (
    <View className="gap-6 w-full items-center">
      <View className="w-[80%] gap-3">
        <Text className="text-textBlack">
          Nome <Text className="text-textDanger">*</Text>
        </Text>
        <View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Digite seu nome..."
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.textFourth}
                className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0 text-textBlack"
              />
            )}
          />
          {errors.name && (
            <Text className="text-textDanger">{errors.name.message}</Text>
          )}
        </View>
      </View>
      <View className="w-[80%] gap-3">
        <Text className="text-textBlack">
          Email <Text className="text-textDanger">*</Text>
        </Text>
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Digite seu email..."
                onChangeText={onChange}
                value={value}
                placeholderTextColor={colors.textFourth}
                className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0 text-textBlack"
              />
            )}
          />
          {errors.email && (
            <Text className="text-textDanger">{errors.email.message}</Text>
          )}
        </View>
      </View>
      <View className="w-[80%] gap-3">
        <Text className="text-textBlack">
          Senha <Text className="text-textDanger">*</Text>
        </Text>
        <View>
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
      <View className="w-[80%] gap-2">
        <TouchableOpacity
          className="bg-button-primary py-3 px-2 rounded-xl items-center"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-textPrimary">Entrar</Text>
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-textBlack" onPress={() => router.push("/login")}>
            Já tem uma conta?{" "}
            <Text className="text-textSecondary underline">Entrar</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
