import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { LOGIN_FORM_SCHEMA } from "./entities/login-form.constants";
import { LoginFormSchema } from "./entities/login-form.types";

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
  });

  const onSubmit = (data: LoginFormSchema) => {
    console.log("dados:", data);
  };

  return (
    <View className="gap-6 items-center w-full">
      <View className="w-[80%] gap-3">
        <Text>
          Email <span className="text-textDanger">*</span>
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              className="p-3 rounded-lg border-[#E6E6E6] border-[2px]"
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
            Senha <span className="text-textDanger">*</span>
          </Text>
          <Text className="text-textSecondary">Esqueceu a senha</Text>
        </View>
        <View className="gap-5">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                className="p-3 rounded border-[#E6E6E6] border-[2px]"
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500">{errors.password.message}</Text>
          )}
          <View>
            {/* add a radioButton or similar */}
            <Text>Lembrar senha</Text>
          </View>
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
            <span className="text-textSecondary underline">Crie Agora</span>
          </Text>
        </View>
      </View>
    </View>
  );
}
