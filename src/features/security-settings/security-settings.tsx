import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { NewPasswordStep } from "@/src/features/forgot-password/components/new-password-step";
import { RequestCodeStep } from "@/src/features/forgot-password/components/request-code-step";
import { VerifyCodeStep } from "@/src/features/forgot-password/components/verify-code-step";
import { ForgotPasswordStep } from "@/src/features/forgot-password/entities/forgot-password.types";

const STEP_TITLES: Record<ForgotPasswordStep, string> = {
  REQUEST_CODE: "Alterar senha",
  VERIFY_CODE: "Verifique seu e-mail",
  NEW_PASSWORD: "Nova senha",
};

export function SecuritySettings() {
  const [step, setStep] = useState<ForgotPasswordStep>("REQUEST_CODE");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleDone = () => {
    setStep("REQUEST_CODE");
    setEmail("");
    setResetToken("");
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="bg-bgPrimary"
      contentContainerStyle={{ padding: 24, gap: 16 }}
    >
      <View className="gap-4 rounded-2xl bg-bgThird p-4">
        <Text className="text-lg font-bold text-textBlack">
          {STEP_TITLES[step]}
        </Text>

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
          <NewPasswordStep resetToken={resetToken} onSuccess={handleDone} />
        )}
      </View>
    </ScrollView>
  );
}
