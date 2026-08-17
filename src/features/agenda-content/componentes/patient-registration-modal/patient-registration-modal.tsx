import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  isValidBirthDate,
  isValidCpf,
  isValidPhone,
} from "@/src/utils/validation.util";

interface PatientRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  cpf: string;
  setCpf: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

type FieldName = "cpf" | "birthDate" | "phone";

export default function PatientRegistrationModal({
  visible,
  onClose,
  cpf,
  setCpf,
  birthDate,
  setBirthDate,
  phone,
  setPhone,
  onSubmit,
  isSubmitting,
}: PatientRegistrationModalProps) {
  const colors = useThemeColors();
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    cpf: false,
    birthDate: false,
    phone: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (visible) {
      setTouched({ cpf: false, birthDate: false, phone: false });
      setSubmitAttempted(false);
    }
  }, [visible]);

  const cpfError = !cpf.trim()
    ? "Informe o CPF"
    : !isValidCpf(cpf)
      ? "CPF inválido"
      : undefined;

  const birthDateError = !birthDate.trim()
    ? "Informe a data de nascimento"
    : !isValidBirthDate(birthDate)
      ? "Data de nascimento inválida"
      : undefined;

  const phoneError = !phone.trim()
    ? "Informe o telefone"
    : !isValidPhone(phone)
      ? "Telefone inválido"
      : undefined;

  const showCpfError = (touched.cpf || submitAttempted) && cpfError;
  const showBirthDateError =
    (touched.birthDate || submitAttempted) && birthDateError;
  const showPhoneError = (touched.phone || submitAttempted) && phoneError;

  const handleBlur = (field: FieldName) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);

    if (cpfError || birthDateError || phoneError) return;

    onSubmit();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <View className="w-full rounded-[24px] bg-bgThird p-5">
          <View className="mb-4">
            <Text className="text-lg font-semibold text-textBlack">
              Complete seu cadastro
            </Text>
            <Text className="mt-1 text-sm text-textFourth">
              Precisamos de alguns dados para criar seu perfil de paciente e
              concluir o agendamento.
            </Text>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="gap-3">
              <View>
                <Text className="mb-1 text-sm font-medium text-textBlack">
                  CPF
                </Text>
                <TextInput
                  value={cpf}
                  onChangeText={setCpf}
                  onBlur={() => handleBlur("cpf")}
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textFourth}
                  className={`rounded-[16px] border bg-infoBg px-3 py-3 text-textBlack ${
                    showCpfError ? "border-textDanger" : "border-infoBorder"
                  }`}
                />
                {showCpfError && (
                  <Text className="mt-1 text-xs text-textDanger">
                    {cpfError}
                  </Text>
                )}
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-textBlack">
                  Data de nascimento
                </Text>
                <TextInput
                  value={birthDate}
                  onChangeText={setBirthDate}
                  onBlur={() => handleBlur("birthDate")}
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textFourth}
                  className={`rounded-[16px] border bg-infoBg px-3 py-3 text-textBlack ${
                    showBirthDateError ? "border-textDanger" : "border-infoBorder"
                  }`}
                />
                {showBirthDateError && (
                  <Text className="mt-1 text-xs text-textDanger">
                    {birthDateError}
                  </Text>
                )}
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-textBlack">
                  Telefone
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  onBlur={() => handleBlur("phone")}
                  placeholder="(11) 99999-9999"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textFourth}
                  className={`rounded-[16px] border bg-infoBg px-3 py-3 text-textBlack ${
                    showPhoneError ? "border-textDanger" : "border-infoBorder"
                  }`}
                />
                {showPhoneError && (
                  <Text className="mt-1 text-xs text-textDanger">
                    {phoneError}
                  </Text>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View className="mt-5 flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 rounded-[16px] border border-borderPrimary bg-bgThird px-4 py-3"
            >
              <Text className="text-center text-sm font-semibold text-textBlack">
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 rounded-[16px] px-4 py-3 ${
                isSubmitting ? "bg-buttonPrimary" : "bg-bgSecondary"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.textPrimary} />
              ) : (
                <Text className="text-center text-sm font-semibold text-textPrimary">
                  Salvar e continuar
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
