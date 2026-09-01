import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetExamBookingsByPatientId } from "@/src/api/get-exam-bookings-by-patient-id";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetQueueItemByPatientId } from "@/src/api/get-queue-item-by-patient-id";
import { useGetUser } from "@/src/api/get-user-me";
import Header from "@/src/components/header/header";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import {
  EAppointmentStatus,
  IAppointment,
} from "@/src/config/entities/appointments/appointments.types";
import {
  EExamBookingStatus,
  IExamBooking,
} from "@/src/config/entities/exam-bookings/exam-bookings.type";
import AppointmentCard from "@/src/features/main-content/components/upcoming-visits/appointment-card";
import ExamBookingCard from "@/src/features/main-content/components/upcoming-visits/exam-booking-card";
import { getVisibleVisits } from "@/src/features/main-content/components/upcoming-visits/upcoming-visits.util";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { getExamComparableDate } from "@/src/utils/exam-scheduling.util";
import { router } from "expo-router";
import { CalendarClock } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function UpcomingVisitsScreen() {
  const colors = useThemeColors();
  const [now, setNow] = useState(() => new Date());

  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );
  const patientId = patient?._id;

  const { data: healthUnits } = useGetHealthUnits();

  const { data: appointments, isLoading: isAppointmentsLoading } =
    useGetAppointmentsByPatientId(
      { patientId: patientId || "" },
      { enabled: Boolean(patientId) },
    );

  const { data: examBookings, isLoading: isExamBookingsLoading } =
    useGetExamBookingsByPatientId(
      { patientId: patientId || "" },
      { enabled: Boolean(patientId) },
    );

  const { data: queueItems } = useGetQueueItemByPatientId(
    { patientId: patientId || "" },
    { enabled: Boolean(patientId) },
  );

  const upcomingAppointments = useMemo(() => {
    const nowSnapshot = new Date();

    return (
      appointments
        ?.filter(
          (item) =>
            item.status === EAppointmentStatus.SCHEDULED &&
            new Date(item.dateTime) > nowSnapshot,
        )
        .sort(
          (first, second) =>
            new Date(first.dateTime).getTime() -
            new Date(second.dateTime).getTime(),
        ) ?? []
    );
  }, [appointments]);

  const upcomingExamBookings = useMemo(() => {
    const nowSnapshot = new Date();

    return (
      examBookings
        ?.filter(
          (booking) =>
            (booking.status === EExamBookingStatus.SCHEDULED ||
              booking.status === EExamBookingStatus.CONFIRMED) &&
            getExamComparableDate(booking.scheduledAt) > nowSnapshot,
        )
        .sort(
          (first, second) =>
            new Date(first.scheduledAt).getTime() -
            new Date(second.scheduledAt).getTime(),
        ) ?? []
    );
  }, [examBookings]);

  const visits = getVisibleVisits(
    upcomingAppointments,
    upcomingExamBookings,
    now,
  );

  useEffect(() => {
    if (visits.length === 0) return;

    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [visits.length]);

  const handlePressAppointment = (pressedAppointment: IAppointment) => {
    const queueId = queueItems?.find(
      (item) => item._id === pressedAppointment.queueItemId,
    )?.queueId;

    if (!queueId) {
      Toast.show({
        type: "info",
        text1: "Fila ainda não disponível",
        text2: "A fila desta consulta será aberta no dia do atendimento.",
      });
      return;
    }

    router.push({
      pathname: "/queue-info/[id]",
      params: { id: queueId },
    });
  };

  const handlePressExam = (examBooking: IExamBooking) => {
    router.push(`/exam-scheduling/booking/${examBooking._id}`);
  };

  const isLoading =
    Boolean(patientId) && (isAppointmentsLoading || isExamBookingsLoading);

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Consultas e exames marcados" />

      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <HistorySkeleton />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={visits}
            keyExtractor={(visit) =>
              visit.type === "appointment"
                ? visit.appointment._id
                : visit.exam._id
            }
            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
            renderItem={({ item: visit }) =>
              visit.type === "appointment" ? (
                <AppointmentCard
                  appointment={visit.appointment}
                  healthUnits={healthUnits}
                  now={now}
                  onPress={handlePressAppointment}
                  fullWidth
                />
              ) : (
                <ExamBookingCard
                  exam={visit.exam}
                  date={visit.date}
                  now={now}
                  onPress={handlePressExam}
                  fullWidth
                />
              )
            }
            ListEmptyComponent={
              <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
                <CalendarClock size={28} color={colors.tabActive} />
                <Text className="mt-3 text-center text-textFifth">
                  Você não possui consultas ou exames marcados no momento.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
