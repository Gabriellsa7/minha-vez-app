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
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                  className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3"
                />
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-[#0F172A]">
                  Data de nascimento
                </Text>
                <TextInput
                  value={birthDate}
                  onChangeText={setBirthDate}
                  placeholder="DD/MM/YYYY"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                  className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3"
                />
              </View>

              <View>
                <Text className="mb-1 text-sm font-medium text-[#0F172A]">
                  Telefone
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="(11) 99999-9999"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                  className="rounded-[16px] border border-[#D7EEF2] bg-[#F4FBFC] px-3 py-3"
                />
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
              onPress={onSubmit}
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
