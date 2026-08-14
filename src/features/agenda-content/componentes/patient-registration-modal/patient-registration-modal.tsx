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
        <View className="w-full rounded-[24px] bg-white p-5">
          <View className="mb-4">
            <Text className="text-lg font-semibold text-[#0F172A]">
              Complete seu cadastro
            </Text>
            <Text className="mt-1 text-sm text-[#64748B]">
              Precisamos de alguns dados para criar seu perfil de paciente e
              concluir o agendamento.
            </Text>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="gap-3">
              <View>
                <Text className="mb-1 text-sm font-medium text-[#0F172A]">
                  CPF
                </Text>
                <TextInput
                  value={cpf}
                  onChangeText={setCpf}
                  onBlur={() => handleBlur("cpf")}
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                  className={`rounded-[16px] border bg-[#F4FBFC] px-3 py-3 ${
                    showCpfError ? "border-red-500" : "border-[#D7EEF2]"
                  }`}
                />
                {showCpfError && (
                  <Text className="mt-1 text-xs text-red-500">
                    {cpfError}
                  </Text>
                )}
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-[#0F172A]">
                  Data de nascimento
                </Text>
                <TextInput
                  value={birthDate}
                  onChangeText={setBirthDate}
                  onBlur={() => handleBlur("birthDate")}
                  placeholder="DD/MM/YYYY"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                  className={`rounded-[16px] border bg-[#F4FBFC] px-3 py-3 ${
                    showBirthDateError ? "border-red-500" : "border-[#D7EEF2]"
                  }`}
                />
                {showBirthDateError && (
                  <Text className="mt-1 text-xs text-red-500">
                    {birthDateError}
                  </Text>
                )}
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-[#0F172A]">
                  Telefone
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  onBlur={() => handleBlur("phone")}
                  placeholder="(11) 99999-9999"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                  className={`rounded-[16px] border bg-[#F4FBFC] px-3 py-3 ${
                    showPhoneError ? "border-red-500" : "border-[#D7EEF2]"
                  }`}
                />
                {showPhoneError && (
                  <Text className="mt-1 text-xs text-red-500">
                    {phoneError}
                  </Text>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View className="mt-5 flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 rounded-[16px] border border-[#CBD5E1] bg-white px-4 py-3"
            >
              <Text className="text-center text-sm font-semibold text-[#0F172A]">
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 rounded-[16px] px-4 py-3 ${
                isSubmitting ? "bg-[#67B5C0]" : "bg-[#008096]"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-center text-sm font-semibold text-white">
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
