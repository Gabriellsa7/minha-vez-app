import { useGetExamBookingsByPatientId } from "@/src/api/get-exam-bookings-by-patient-id";
import { useGetExamsByPatientId } from "@/src/api/get-exams-by-patient-id";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import Header from "@/src/components/header/header";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import {
  EExamBookingStatus,
  IExamBooking,
  isExamResultAvailable,
} from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { formatExamDateTime } from "@/src/utils/exam-scheduling.util";
import { router } from "expo-router";
import {
  CalendarClock,
  CalendarPlus,
  FileText,
  MapPin,
  Stethoscope,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

type ExamsTab = "scheduled" | "results";

export default function ExamsScreen() {
  const [tab, setTab] = useState<ExamsTab>("scheduled");

  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const {
    data: exams,
    isLoading: isExamsLoading,
    isError: isExamsError,
    refetch: refetchExams,
  } = useGetExamsByPatientId(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const {
    data: bookings,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    refetch: refetchBookings,
  } = useGetExamBookingsByPatientId(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const isLoading =
    (tab === "scheduled" ? isBookingsLoading : isExamsLoading) &&
    Boolean(patient?._id);
  const isError = tab === "scheduled" ? isBookingsError : isExamsError;
  const refetch = tab === "scheduled" ? refetchBookings : refetchExams;

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Meus Exames" />

      <View className="flex-1 px-4 pt-4">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/exam-scheduling")}
          className="mb-4 flex-row items-center justify-center gap-2 rounded-xl bg-bgSecondary py-3"
        >
          <CalendarPlus size={18} color="#FFFFFF" />
          <Text className="font-bold text-textPrimary">Agendar novo exame</Text>
        </Pressable>

        <View className="mb-4 flex-row rounded-xl bg-bgThird p-1">
          <Pressable
            onPress={() => setTab("scheduled")}
            className={`flex-1 rounded-lg py-2 ${tab === "scheduled" ? "bg-bgSecondary" : ""}`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                tab === "scheduled" ? "text-textPrimary" : "text-textFifth"
              }`}
            >
              Agendados
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab("results")}
            className={`flex-1 rounded-lg py-2 ${tab === "results" ? "bg-bgSecondary" : ""}`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                tab === "results" ? "text-textPrimary" : "text-textFifth"
              }`}
            >
              Resultados
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <HistorySkeleton />
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-3">
            <Text className="text-center text-textFifth">
              Não foi possível carregar seus exames.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => refetch()}
              className="flex-row items-center gap-2 rounded-lg bg-bgSecondary px-4 py-3"
            >
              <Text className="font-bold text-textPrimary">
                Tentar novamente
              </Text>
            </Pressable>
          </View>
        ) : tab === "scheduled" ? (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {!bookings || bookings.length === 0 ? (
              <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
                <CalendarClock size={28} color="#0F766E" />
                <Text className="mt-3 text-center text-textFifth">
                  Você ainda não possui exames agendados.
                </Text>
              </View>
            ) : (
              bookings.map((booking) => (
                <ExamBookingCard key={booking._id} booking={booking} />
              ))
            )}
          </ScrollView>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {!exams || exams.length === 0 ? (
              <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
                <FileText size={28} color="#0F766E" />
                <Text className="mt-3 text-center text-textFifth">
                  Você ainda não possui exames disponíveis.
                </Text>
              </View>
            ) : (
              exams.map((exam) => (
                <Pressable
                  key={exam._id}
                  accessibilityRole="button"
                  onPress={() => router.push(`/exams/${exam._id}`)}
                  className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
                >
                  <Text className="text-base font-semibold text-textBlack">
                    {exam.examType}
                  </Text>

                  {exam.examDate && (
                    <View className="mt-3 flex-row items-center gap-2">
                      <CalendarClock size={14} color="#A8A8A8" />
                      <Text className="text-xs text-textFourth">
                        {new Date(exam.examDate).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                  )}

                  {exam.doctorName && (
                    <View className="mt-1 flex-row items-center gap-2">
                      <Stethoscope size={14} color="#A8A8A8" />
                      <Text className="text-xs text-textFourth" numberOfLines={1}>
                        {exam.doctorName}
                      </Text>
                    </View>
                  )}

                  {exam.healthUnitName && (
                    <View className="mt-1 flex-row items-center gap-2">
                      <MapPin size={14} color="#A8A8A8" />
                      <Text className="text-xs text-textFourth" numberOfLines={1}>
                        {exam.healthUnitName}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

function ExamBookingCard({ booking }: { booking: IExamBooking }) {
  const hasResult = isExamResultAvailable(booking);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/exam-scheduling/booking/${booking._id}`)}
      className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
    >
      <View className="flex-row items-start justify-between gap-2">
        <Text className="flex-1 text-base font-semibold text-textBlack">
          {booking.examOfferingName}
        </Text>
        <View className={`rounded-full px-3 py-1 ${STATUS_BG[booking.status]}`}>
          <Text className={`text-xs font-semibold ${STATUS_TEXT[booking.status]}`}>
            {hasResult ? "Resultado disponível" : STATUS_LABEL[booking.status]}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <CalendarClock size={14} color="#A8A8A8" />
        <Text className="text-xs text-textFourth">
          {formatExamDateTime(booking.scheduledAt)}
        </Text>
      </View>

      <View className="mt-1 flex-row items-center gap-2">
        <MapPin size={14} color="#A8A8A8" />
        <Text className="text-xs text-textFourth" numberOfLines={1}>
          {booking.healthUnitName}
        </Text>
      </View>
    </Pressable>
  );
}
