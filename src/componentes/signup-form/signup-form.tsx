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

  const onSubmit = () => {
    console.log("Clicked");
  };

  return (
    <View className="gap-6 w-full items-center">
      <View className="w-[80%] gap-3">
        <Text>
          Nome <span className="text-textDanger">*</span>
        </Text>
        <View>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Digite seu nome..."
                onChange={onChange}
                value={value}
                className="p-3 rounded-lg border-[#E6E6E6] border-[2px]"
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500">{errors.name.message}</Text>
          )}
        </View>
      </View>
      <View className="w-[80%] gap-3">
        <Text>
          Email <span className="text-textDanger">*</span>
        </Text>
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Digite seu email..."
                onChange={onChange}
                value={value}
                className="p-3 rounded-lg border-[#E6E6E6] border-[2px]"
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500">{errors.email.message}</Text>
          )}
        </View>
      </View>
      <View className="w-[80%] gap-3">
        <Text>
          Password <span className="text-textDanger">*</span>
        </Text>
        <View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Digite sua senha..."
                onChange={onChange}
                value={value}
                className="p-3 rounded-lg border-[#E6E6E6] border-[2px]"
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
          <Text onPress={() => router.push("/login")}>
            Já tem uma conta?{" "}
            <span className="text-textSecondary underline">Entrar</span>
          </Text>
        </View>
      </View>
    </View>
  );
}
