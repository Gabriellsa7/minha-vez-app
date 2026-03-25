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
        <Text>
          Nome <Text className="text-textDanger">*</Text>
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
                className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0"
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
          Email <Text className="text-textDanger">*</Text>
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
                className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0"
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
          Password <Text className="text-textDanger">*</Text>
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
          <Text onPress={() => router.push("/login")}>
            Já tem uma conta?{" "}
            <Text className="text-textSecondary underline">Entrar</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
