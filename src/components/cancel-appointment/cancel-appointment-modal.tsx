import { useCancelAppointment } from "@/src/api/cancel-appointment";
import { GET_APPOINTMENTS_BY_PATIENT_ID_KEY } from "@/src/api/get-appointment-by-patient-id";
import { GET_QUEUE_ITEMS_KEY } from "@/src/api/get-queue-item-by-patient-id";
import { GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY } from "@/src/api/get-queue-item-by-queue-id";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react-native";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

interface CancelAppointmentModalProps {
  appointmentId: string | null;
  visible: boolean;
  onClose: () => void;
  onCanceled?: () => void;
}

export function CancelAppointmentModal({
  appointmentId,
  visible,
  onClose,
  onCanceled,
}: CancelAppointmentModalProps) {
  const queryClient = useQueryClient();
  const { mutate: cancelAppointment, isPending: isCanceling } =
    useCancelAppointment();

  const handleConfirm = () => {
    if (!appointmentId) return;

    cancelAppointment(
      { id: appointmentId },
      {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Consulta cancelada" });
          queryClient.invalidateQueries({
            queryKey: [GET_APPOINTMENTS_BY_PATIENT_ID_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [GET_QUEUE_ITEMS_KEY],
          });
          queryClient.invalidateQueries({
            queryKey: [GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY],
          });
          onClose();
          onCanceled?.();
        },
        onError: (error: Error) => {
          Toast.show({
            type: "error",
            text1: "Não foi possível cancelar",
            text2: error?.message,
          });
        },
      },
    );
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <View className="w-full rounded-2xl bg-bgThird">
          <View className="flex-row items-center justify-between border-b border-borderPrimary px-5 py-4">
            <Text className="text-lg font-bold text-textBlack">
              Cancelar consulta
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={8}
              disabled={isCanceling}
              onPress={onClose}
            >
              <X size={22} color="#006673" />
            </Pressable>
          </View>

          <View className="gap-4 px-5 py-5">
            <Text className="text-base text-textFifth">
              Tem certeza que deseja cancelar esta consulta? Essa ação não
              pode ser desfeita.
            </Text>

            <Pressable
              accessibilityRole="button"
              disabled={isCanceling}
              onPress={handleConfirm}
              className={`items-center rounded-xl py-3 ${
                isCanceling ? "bg-[#E29B9B]" : "bg-[#BA1A1A]"
              }`}
            >
              {isCanceling ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="font-bold text-white">
                  Cancelar consulta
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
