import { IExamOffering } from "@/src/config/entities/exam-offerings/exam-offerings.type";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { getExamDateTimeFromDateAndTime } from "@/src/utils/exam-scheduling.util";
import { CheckCircle2 } from "lucide-react-native";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

interface ExamBookingConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  selectedUnit?: IHealthUnit;
  offering?: IExamOffering;
  selectedDate: string;
  selectedTime: string;
  onConfirm: () => void;
  isConfirming: boolean;
}

export default function ExamBookingConfirmModal({
  visible,
  onClose,
  selectedUnit,
  offering,
  selectedDate,
  selectedTime,
  onConfirm,
  isConfirming,
}: ExamBookingConfirmModalProps) {
  const colors = useThemeColors();
  const dateTimeLabel =
    selectedDate && selectedTime
      ? getExamDateTimeFromDateAndTime(
          selectedDate,
          selectedTime,
        ).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        })
      : "Selecione uma data e horário";

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <View className="w-full rounded-[24px] bg-bgThird p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <CheckCircle2 size={22} color={colors.textSecondary} />
            <Text className="text-lg font-semibold text-textBlack">
              Resumo do agendamento
            </Text>
          </View>

          <View className="gap-3">
            <View className="rounded-[16px] bg-infoBg p-3">
              <Text className="text-sm text-textFourth">Exame</Text>
              <Text className="text-base font-semibold text-textBlack">
                {offering?.name || "Selecionado"}
              </Text>
            </View>
            <View className="rounded-[16px] bg-infoBg p-3">
              <Text className="text-sm text-textFourth">Clínica</Text>
              <Text className="text-base font-semibold text-textBlack">
                {selectedUnit?.name || "Selecionada"}
              </Text>
            </View>
            <View className="rounded-[16px] bg-infoBg p-3">
              <Text className="text-sm text-textFourth">Endereço</Text>
              <Text className="text-base font-semibold text-textBlack">
                {selectedUnit?.address.street}, {selectedUnit?.address.number}{" "}
                - {selectedUnit?.address.neighborhood}
              </Text>
            </View>
            <View className="rounded-[16px] bg-infoBg p-3">
              <Text className="text-sm text-textFourth">Data e horário</Text>
              <Text className="text-base font-semibold text-textBlack">
                {dateTimeLabel}
              </Text>
            </View>
            {offering?.requiresPreparation && (
              <View className="rounded-[16px] bg-warningBg p-3">
                <Text className="text-sm text-warningText">
                  Orientações de preparo
                </Text>
                <Text className="text-sm font-semibold text-warningText">
                  {offering.preparationInstructions}
                </Text>
              </View>
            )}
            {offering?.requiresFasting && (
              <View className="rounded-[16px] bg-warningBg p-3">
                <Text className="text-sm font-semibold text-warningText">
                  Jejum necessário
                  {offering.fastingHours
                    ? ` de ${offering.fastingHours} horas`
                    : ""}
                </Text>
              </View>
            )}
            {typeof offering?.price === "number" && (
              <View className="rounded-[16px] bg-infoBg p-3">
                <Text className="text-sm text-textFourth">
                  Valor particular
                </Text>
                <Text className="text-base font-semibold text-textBlack">
                  R$ {offering.price.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            )}
            {offering && offering.acceptedInsurances.length > 0 && (
              <View className="rounded-[16px] bg-infoBg p-3">
                <Text className="text-sm text-textFourth">
                  Convênios aceitos
                </Text>
                <Text className="text-base font-semibold text-textBlack">
                  {offering.acceptedInsurances.join(", ")}
                </Text>
              </View>
            )}
          </View>

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
              onPress={onConfirm}
              disabled={isConfirming}
              className={`flex-1 rounded-[16px] px-4 py-3 ${
                isConfirming ? "bg-textThird" : "bg-bgSecondary"
              }`}
            >
              {isConfirming ? (
                <ActivityIndicator size="small" color={colors.textPrimary} />
              ) : (
                <Text className="text-center text-sm font-semibold text-textPrimary">
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
