import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRequestPasswordReset } from "@/src/hooks/useForgotPassword";
import { REQUEST_CODE_SCHEMA } from "../entities/forgot-password.constants";
import { RequestCodeSchema } from "../entities/forgot-password.types";

interface RequestCodeStepProps {
  onSuccess: (email: string) => void;
}

export function RequestCodeStep({ onSuccess }: RequestCodeStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestCodeSchema>({
    resolver: zodResolver(REQUEST_CODE_SCHEMA),
  });

  const { mutate: requestCode, isPending } = useRequestPasswordReset();

  const onSubmit = (data: RequestCodeSchema) => {
    requestCode(
      { email: data.email },
      { onSuccess: () => onSuccess(data.email) },
    );
  };

  return (
    <View className="gap-4">
      <Text className="text-textSecondary">
        Digite o e-mail cadastrado na sua conta para receber um código de
        verificação.
      </Text>

      <View className="gap-2">
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
              autoCapitalize="none"
              onChangeText={onChange}
              className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500">{errors.email.message}</Text>
        )}
      </View>

      <TouchableOpacity
        className="bg-button-primary py-3 px-2 rounded-xl items-center"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text className="text-textPrimary">Enviar código</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
