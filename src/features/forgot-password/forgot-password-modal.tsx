import { X } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { NewPasswordStep } from "./components/new-password-step";
import { RequestCodeStep } from "./components/request-code-step";
import { VerifyCodeStep } from "./components/verify-code-step";
import { ForgotPasswordStep } from "./entities/forgot-password.types";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const STEP_TITLES: Record<ForgotPasswordStep, string> = {
  REQUEST_CODE: "Esqueceu sua senha?",
  VERIFY_CODE: "Verifique seu e-mail",
  NEW_PASSWORD: "Nova senha",
};

export function ForgotPasswordModal({
  visible,
  onClose,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<ForgotPasswordStep>("REQUEST_CODE");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const colors = useThemeColors();

  const handleClose = () => {
    setStep("REQUEST_CODE");
    setEmail("");
    setResetToken("");
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <View className="w-full rounded-[24px] bg-bgThird">
            <View className="flex-row items-center justify-between border-b border-borderPrimary px-5 py-4">
              <Text className="text-lg font-bold text-textBlack">
                {STEP_TITLES[step]}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                hitSlop={8}
                onPress={handleClose}
              >
                <X size={22} color={colors.textBlack} />
              </Pressable>
            </View>

            <View className="p-5">
              {step === "REQUEST_CODE" && (
                <RequestCodeStep
                  onSuccess={(requestedEmail) => {
                    setEmail(requestedEmail);
                    setStep("VERIFY_CODE");
                  }}
                />
              )}
              {step === "VERIFY_CODE" && (
                <VerifyCodeStep
                  email={email}
                  onSuccess={(token) => {
                    setResetToken(token);
                    setStep("NEW_PASSWORD");
                  }}
                />
              )}
              {step === "NEW_PASSWORD" && (
                <NewPasswordStep
                  resetToken={resetToken}
                  onSuccess={handleClose}
                />
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
