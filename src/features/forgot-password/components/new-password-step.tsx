import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import { PasswordInput } from "@/src/components/password-input/password-input";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useResetPassword } from "@/src/hooks/useForgotPassword";
import { NEW_PASSWORD_SCHEMA } from "../entities/forgot-password.constants";
import { NewPasswordSchema } from "../entities/forgot-password.types";

interface NewPasswordStepProps {
  resetToken: string;
  onSuccess: () => void;
}

export function NewPasswordStep({ resetToken, onSuccess }: NewPasswordStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordSchema>({
    resolver: zodResolver(NEW_PASSWORD_SCHEMA),
  });

  const { mutate: confirmResetPassword, isPending } = useResetPassword();
  const colors = useThemeColors();

  const onSubmit = (data: NewPasswordSchema) => {
    confirmResetPassword(
      { resetToken, newPassword: data.password },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Senha redefinida",
            text2: "Sua senha foi atualizada com sucesso.",
          });
          onSuccess();
        },
      },
    );
  };

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-textBlack">
          Nova senha <Text className="text-textDanger">*</Text>
        </Text>
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

      <View className="gap-2">
        <Text className="text-textBlack">
          Confirmar nova senha <Text className="text-textDanger">*</Text>
        </Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <PasswordInput value={value} onChangeText={onChange} />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-textDanger">{errors.confirmPassword.message}</Text>
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
          <Text className="text-textPrimary">Confirmar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
