import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { formatDateTime } from "@/src/utils/format-date-time";
import { CheckCircle2 } from "lucide-react-native";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

interface AppointmentConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  selectedUnit?: IHealthUnit;
  selectedProfessional?: IHealthProfessional;
  selectedDate: string;
  selectedTime: string;
  onConfirm: () => void;
  isConfirming: boolean;
}

export default function AppointmentConfirmModal({
  visible,
  onClose,
  selectedUnit,
  selectedProfessional,
  selectedDate,
  selectedTime,
  onConfirm,
  isConfirming,
}: AppointmentConfirmModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <View className="w-full rounded-[24px] bg-white p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <CheckCircle2 size={22} color="#008096" />
            <Text className="text-lg font-semibold text-[#0F172A]">
              Resumo do agendamento
            </Text>
          </View>

          <View className="gap-3">
            <View className="rounded-[16px] bg-[#F4FBFC] p-3">
              <Text className="text-sm text-[#64748B]">Unidade</Text>
              <Text className="text-base font-semibold text-[#0F172A]">
                {selectedUnit?.name || "Selecionada"}
              </Text>
            </View>
            <View className="rounded-[16px] bg-[#F4FBFC] p-3">
              <Text className="text-sm text-[#64748B]">Cidade</Text>
              <Text className="text-base font-semibold text-[#0F172A]">
                {selectedUnit?.address.city || "Selecionada"} -{" "}
                {selectedUnit?.address.state}
              </Text>
            </View>
            <View className="rounded-[16px] bg-[#F4FBFC] p-3">
              <Text className="text-sm text-[#64748B]">Endereço</Text>
              <Text className="text-base font-semibold text-[#0F172A]">
                {selectedUnit?.address.street}
              </Text>
            </View>
            <View className="rounded-[16px] bg-[#F4FBFC] p-3">
              <Text className="text-sm text-[#64748B]">Complemento</Text>
              <Text className="text-base font-semibold text-[#0F172A]">
                {selectedUnit?.address.complement}
              </Text>
            </View>
            <View className="rounded-[16px] bg-[#F4FBFC] p-3">
              <Text className="text-sm text-[#64748B]">Profissional</Text>
              <Text className="text-base font-semibold text-[#0F172A]">
                {selectedProfessional?.specialty || "Selecione"}
              </Text>
            </View>
            <View className="rounded-[16px] bg-[#F4FBFC] p-3">
              <Text className="text-sm text-[#64748B]">Data e horário</Text>
              <Text className="text-base font-semibold text-[#0F172A]">
                {selectedDate && selectedTime
                  ? formatDateTime(`${selectedDate}T${selectedTime}:00`)
                  : "Selecione uma data e horário"}
              </Text>
            </View>
          </View>

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
              onPress={onConfirm}
              disabled={isConfirming}
              className={`flex-1 rounded-[16px] px-4 py-3 ${
                isConfirming ? "bg-[#67B5C0]" : "bg-[#008096]"
              }`}
            >
              {isConfirming ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-center text-sm font-semibold text-white">
                  Confirmar
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
