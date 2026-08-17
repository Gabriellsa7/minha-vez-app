import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useVerifyResetCode } from "@/src/hooks/useForgotPassword";
import { VERIFY_CODE_SCHEMA } from "../entities/forgot-password.constants";
import { VerifyCodeSchema } from "../entities/forgot-password.types";

interface VerifyCodeStepProps {
  email: string;
  onSuccess: (resetToken: string) => void;
}

export function VerifyCodeStep({ email, onSuccess }: VerifyCodeStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeSchema>({
    resolver: zodResolver(VERIFY_CODE_SCHEMA),
  });

  const { mutate: verifyCode, isPending } = useVerifyResetCode();
  const colors = useThemeColors();

  const onSubmit = (data: VerifyCodeSchema) => {
    verifyCode(
      { email, code: data.code },
      { onSuccess: (response) => onSuccess(response.resetToken) },
    );
  };

  return (
    <View className="gap-4">
      <Text className="text-textSecondary">
        Enviamos um código de 6 dígitos para {email}. Digite-o abaixo para
        continuar.
      </Text>

      <View className="gap-2">
        <Text className="text-textBlack">
          Código <Text className="text-textDanger">*</Text>
        </Text>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="000000"
              value={value}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={onChange}
              placeholderTextColor={colors.textFourth}
              className="p-3 rounded-lg border-borderPrimary border-[2px] focus:outline-none focus:ring-0 text-textBlack"
            />
          )}
        />
        {errors.code && (
          <Text className="text-textDanger">{errors.code.message}</Text>
        )}
      </View>

      <TouchableOpacity
        className="bg-button-primary py-3 px-2 rounded-xl items-center"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator size="small" color={colors.textPrimary} />
        ) : (
          <Text className="text-textPrimary">Verificar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
