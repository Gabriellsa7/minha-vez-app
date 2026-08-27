import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Check, ChevronDown } from "lucide-react-native";

import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  isValidBirthDate,
  isValidCpf,
  isValidPhone,
} from "@/src/utils/validation.util";
import { calculateAge, normalizeBirthDate } from "@/src/utils/util";
import {
  ELDERLY_AGE_THRESHOLD,
  PRIORITY_LABEL,
  PRIORITY_REASON_OPTIONS,
  PRIORITY_REASONS_REQUIRING_PROOF,
} from "@/src/config/entities/patients/patients.constants";
import { EPatientPriority } from "@/src/config/entities/patients/patients.type";

interface PatientRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  cpf: string;
  setCpf: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  priority: EPatientPriority;
  setPriority: (value: EPatientPriority) => void;
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
  priority,
  setPriority,
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
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);

  useEffect(() => {
    if (visible) {
      setTouched({ cpf: false, birthDate: false, phone: false });
      setSubmitAttempted(false);
      setShowPriorityOptions(false);
    }
  }, [visible]);

  const age = isValidBirthDate(birthDate)
    ? calculateAge(normalizeBirthDate(birthDate))
    : null;
  const isAutoElderly = age !== null && age > ELDERLY_AGE_THRESHOLD;
  const requiresProof =
    !isAutoElderly && PRIORITY_REASONS_REQUIRING_PROOF.has(priority);

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
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <View className="w-full max-h-[90%] rounded-[24px] bg-bgThird p-5">
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
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
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
                        showBirthDateError
                          ? "border-textDanger"
                          : "border-infoBorder"
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
                        showPhoneError
                          ? "border-textDanger"
                          : "border-infoBorder"
                      }`}
                    />
                    {showPhoneError && (
                      <Text className="mt-1 text-xs text-textDanger">
                        {phoneError}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="mb-1 text-sm font-medium text-textBlack">
                      Prioridade de atendimento
                    </Text>

                    {isAutoElderly ? (
                      <View className="rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3">
                        <Text className="text-textBlack">
                          {PRIORITY_LABEL[EPatientPriority.ELDERLY]}
                        </Text>
                        <Text className="mt-1 text-xs text-textFourth">
                          Identificado automaticamente pela idade informada.
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => setShowPriorityOptions(true)}
                        className="flex-row items-center justify-between rounded-[16px] border border-infoBorder bg-infoBg px-3 py-3"
                      >
                        <Text className="text-textBlack">
                          {PRIORITY_LABEL[priority]}
                        </Text>
                        <ChevronDown size={18} color={colors.textFourth} />
                      </Pressable>
                    )}

                    {requiresProof && (
                      <View className="mt-2 rounded-[16px] border border-warningBorder bg-warningBg p-3">
                        <Text className="text-xs font-medium text-warningText">
                          Leve um comprovante médico dessa condição no dia do
                          atendimento. Você também pode anexá-lo pelo seu
                          perfil, em Informações de Saúde.
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>
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
      </KeyboardAvoidingView>

      <Modal
        transparent
        animationType="fade"
        visible={showPriorityOptions}
        onRequestClose={() => setShowPriorityOptions(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-5"
          onPress={() => setShowPriorityOptions(false)}
        >
          <View className="w-full max-h-[70%] rounded-[24px] bg-bgThird p-5">
            <Text className="mb-3 text-lg font-semibold text-textBlack">
              Prioridade de atendimento
            </Text>
            <ScrollView>
              {PRIORITY_REASON_OPTIONS.map((option, index) => {
                const isSelected = option === priority;

                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      setPriority(option);
                      setShowPriorityOptions(false);
                    }}
                    className={`flex-row items-center justify-between py-3 ${
                      index > 0 ? "border-t border-borderPrimary" : ""
                    }`}
                  >
                    <Text className="text-textBlack">
                      {PRIORITY_LABEL[option]}
                    </Text>
                    {isSelected && (
                      <Check size={18} color={colors.textSecondary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </Modal>
  );
}
