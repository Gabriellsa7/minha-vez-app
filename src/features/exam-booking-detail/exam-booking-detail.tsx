import { useCancelExamBooking } from "@/src/api/cancel-exam-booking";
import { GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY } from "@/src/api/get-exam-bookings-by-patient-id";
import { useGetExamBookingById } from "@/src/api/get-exam-booking-by-id";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import {
  EExamBookingStatus,
  isExamResultAvailable,
} from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { formatExamDateTime } from "@/src/utils/exam-scheduling.util";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { CalendarClock, FileCheck2, MapPin } from "lucide-react-native";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const STATUS_LABEL: Record<EExamBookingStatus, string> = {
  [EExamBookingStatus.SCHEDULED]: "Agendado",
  [EExamBookingStatus.CONFIRMED]: "Confirmado",
  [EExamBookingStatus.IN_PROGRESS]: "Em atendimento",
  [EExamBookingStatus.COMPLETED]: "Realizado",
  [EExamBookingStatus.CANCELED]: "Cancelado",
  [EExamBookingStatus.NO_SHOW]: "Não compareceu",
};

const STATUS_BG: Record<EExamBookingStatus, string> = {
  [EExamBookingStatus.SCHEDULED]: "bg-[#E6F0FB]",
  [EExamBookingStatus.CONFIRMED]: "bg-[#E6F4F4]",
  [EExamBookingStatus.IN_PROGRESS]: "bg-[#FEF3C7]",
  [EExamBookingStatus.COMPLETED]: "bg-[#E6F7EF]",
  [EExamBookingStatus.CANCELED]: "bg-[#FDEAEA]",
  [EExamBookingStatus.NO_SHOW]: "bg-[#F1F0F0]",
};

const STATUS_TEXT: Record<EExamBookingStatus, string> = {
  [EExamBookingStatus.SCHEDULED]: "text-[#2563EB]",
  [EExamBookingStatus.CONFIRMED]: "text-[#08777A]",
  [EExamBookingStatus.IN_PROGRESS]: "text-[#B45309]",
  [EExamBookingStatus.COMPLETED]: "text-[#0F9D58]",
  [EExamBookingStatus.CANCELED]: "text-[#BA1A1A]",
  [EExamBookingStatus.NO_SHOW]: "text-[#6B7280]",
};

interface ExamBookingDetailProps {
  bookingId: string;
}

export function ExamBookingDetail({ bookingId }: ExamBookingDetailProps) {
  const queryClient = useQueryClient();

  const {
    data: booking,
    isLoading,
    isError,
    refetch,
  } = useGetExamBookingById({ id: bookingId }, { enabled: Boolean(bookingId) });

  const { mutate: cancelBooking, isPending: isCanceling } =
    useCancelExamBooking();

  const canCancel =
    booking?.status === EExamBookingStatus.SCHEDULED ||
    booking?.status === EExamBookingStatus.CONFIRMED;

  const hasResult = booking ? isExamResultAvailable(booking) : false;

  const handleCancel = () => {
    if (!booking) return;

    Alert.alert(
      "Cancelar agendamento",
      "Tem certeza que deseja cancelar este exame agendado?",
      [
        { text: "Voltar", style: "cancel" },
        {
          text: "Cancelar agendamento",
          style: "destructive",
          onPress: () => {
            cancelBooking(
              { id: booking._id },
              {
                onSuccess: () => {
                  Toast.show({ type: "success", text1: "Agendamento cancelado" });
                  queryClient.invalidateQueries({
                    queryKey: [GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY],
                  });
                  refetch();
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
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 px-4 pt-4">
        <HistorySkeleton />
      </View>
    );
  }

  if (isError || !booking) {
    return (
      <View className="flex-1 items-center justify-center gap-3 px-4">
        <Text className="text-center text-textFifth">
          Não foi possível carregar este agendamento.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => refetch()}
          className="flex-row items-center gap-2 rounded-lg bg-bgSecondary px-4 py-3"
        >
          <Text className="font-bold text-textPrimary">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <View className="rounded-2xl border border-borderPrimary bg-bgThird p-4">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-lg font-semibold text-textBlack">
            {booking.examOfferingName}
          </Text>
          <View className={`rounded-full px-3 py-1 ${STATUS_BG[booking.status]}`}>
            <Text className={`text-xs font-semibold ${STATUS_TEXT[booking.status]}`}>
              {hasResult ? "Resultado disponível" : STATUS_LABEL[booking.status]}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          <CalendarClock size={16} color="#A8A8A8" />
          <Text className="text-sm text-textFourth">
            {formatExamDateTime(booking.scheduledAt)}
          </Text>
        </View>

        <View className="mt-2 flex-row items-center gap-2">
          <MapPin size={16} color="#A8A8A8" />
          <Text className="text-sm text-textFourth">{booking.healthUnitName}</Text>
        </View>

        {typeof booking.priceSnapshot === "number" && (
          <Text className="mt-3 text-sm font-semibold text-textBlack">
            Valor: R$ {booking.priceSnapshot.toFixed(2).replace(".", ",")}
          </Text>
        )}

        {booking.cancelReason && (
          <Text className="mt-3 text-sm text-textFourth">
            Motivo: {booking.cancelReason}
          </Text>
        )}
      </View>

      {hasResult && booking.resultExamId && (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push(`/exams/${booking.resultExamId}`)}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-bgSecondary py-3"
        >
          <FileCheck2 size={18} color="#FFFFFF" />
          <Text className="font-bold text-textPrimary">Ver Resultado</Text>
        </Pressable>
      )}

      {canCancel && (
        <Pressable
          accessibilityRole="button"
          disabled={isCanceling}
          onPress={handleCancel}
          className="mb-6 mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-borderPrimary py-3"
        >
          <Text className="font-semibold text-textDanger">
            {isCanceling ? "Cancelando..." : "Cancelar agendamento"}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
