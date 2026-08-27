import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetExamBookingsByPatientId } from "@/src/api/get-exam-bookings-by-patient-id";
import { useGetHealthProfessionalByAppointmentId } from "@/src/api/get-health-professional-by-appointment-id";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetQueueItemByPatientId } from "@/src/api/get-queue-item-by-patient-id";
import SearchInput from "@/src/components/search-input/search-input";
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import {
  EExamBookingStatus,
  IExamBooking,
} from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { IPatient } from "@/src/config/entities/patients/patients.type";
import { IUser } from "@/src/config/entities/user/user.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  formatExamDateTime,
  getExamComparableDate,
} from "@/src/utils/exam-scheduling.util";
import { formatDateTime } from "@/src/utils/format-date-time";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Bell, Clock, ListChecks, TestTube } from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import HomeHeader from "./components/header/header";
import HealthUnits from "./components/health-units/health-units";
import QueueDetails from "./components/queue-details/queue-details";
import { QuickServices } from "./components/quick-services/quick-services";
import UpcomingVisits from "./components/upcoming-visits/upcoming-visits";

interface MainContentProps {
  user: IUser;
  patient?: IPatient | null;
}

export default function MainContent({ user, patient }: MainContentProps) {
  const colors = useThemeColors();
  const { data: healthUnits } = useGetHealthUnits();

  const tabBarHeight = useBottomTabBarHeight();

  const patientId = patient?._id;

  const { data: userAppointments, isLoading: isAppointmentsLoading } =
    useGetAppointmentsByPatientId(
      {
        patientId: patientId || "",
      },
      {
        enabled: !!patientId,
      },
    );

  const appointment = useMemo(() => {
    const now = new Date();

    return userAppointments
      ?.filter(
        (item) =>
          item.status === EAppointmentStatus.SCHEDULED &&
          new Date(item.dateTime) > now,
      )
      .sort(
        (first, second) =>
          new Date(first.dateTime).getTime() -
          new Date(second.dateTime).getTime(),
      )[0];
  }, [userAppointments]);

  if (isAppointmentsLoading) {
    console.log("Carregando appointments...");
  }

  const { data: professional } = useGetHealthProfessionalByAppointmentId(
    {
      appointmentId: appointment?._id || "",
    },
    {
      enabled: !!appointment?._id,
    },
  );

  const { data: examBookings } = useGetExamBookingsByPatientId(
    { patientId: patientId || "" },
    { enabled: !!patientId },
  );

  const { data: queueItems } = useGetQueueItemByPatientId(
    { patientId: patientId || "" },
    { enabled: !!patientId },
  );

  const upcomingExamBookings = useMemo(() => {
    const now = new Date();

    return (
      examBookings
        ?.filter(
          (booking) =>
            (booking.status === EExamBookingStatus.SCHEDULED ||
              booking.status === EExamBookingStatus.CONFIRMED) &&
            getExamComparableDate(booking.scheduledAt) > now,
        )
        .sort(
          (first, second) =>
            new Date(first.scheduledAt).getTime() -
            new Date(second.scheduledAt).getTime(),
        ) ?? []
    );
  }, [examBookings]);

  const nextExamBooking = upcomingExamBookings[0];

  const appointmentUnit = useMemo(
    () => healthUnits?.find((unit) => unit._id === professional?.healthUnitId),
    [healthUnits, professional?.healthUnitId],
  );

  // The home screen surfaces whichever is soonest — a consulta or an exame
  // agendado — since a patient can have either (or both) coming up, and the
  // banner must say which one it is instead of always calling it a "exame".
  const nextUpcomingVisit = useMemo(() => {
    const appointmentDate =
      appointment && !appointment.finishedAt
        ? new Date(appointment.dateTime)
        : null;
    const examDate = nextExamBooking
      ? getExamComparableDate(nextExamBooking.scheduledAt)
      : null;

    if (appointmentDate && examDate) {
      return appointmentDate <= examDate
        ? { type: "appointment" as const, date: appointmentDate }
        : {
            type: "exam" as const,
            date: examDate,
            examBooking: nextExamBooking as IExamBooking,
          };
    }

    if (appointmentDate) {
      return { type: "appointment" as const, date: appointmentDate };
    }

    if (examDate) {
      return {
        type: "exam" as const,
        date: examDate,
        examBooking: nextExamBooking as IExamBooking,
      };
    }

    return null;
  }, [appointment, nextExamBooking]);

  const appointmentQueueId = useMemo(
    () =>
      queueItems?.find((item) => item._id === appointment?.queueItemId)
        ?.queueId,
    [queueItems, appointment?.queueItemId],
  );

  const handleUpcomingVisitPress = () => {
    if (!nextUpcomingVisit) return;

    if (nextUpcomingVisit.type === "exam") {
      router.push(
        `/exam-scheduling/booking/${nextUpcomingVisit.examBooking._id}`,
      );
      return;
    }

    if (appointmentQueueId) {
      router.push({
        pathname: "/queue-info/[id]",
        params: { id: appointmentQueueId },
      });
    }
  };

  const handlePressAppointment = () => {
    if (!appointmentQueueId) {
      Toast.show({
        type: "info",
        text1: "Fila ainda não disponível",
        text2: "A fila desta consulta será aberta no dia do atendimento.",
      });
      return;
    }

    router.push({
      pathname: "/queue-info/[id]",
      params: { id: appointmentQueueId },
    });
  };

  const handlePressExam = (examBooking: IExamBooking) => {
    router.push(`/exam-scheduling/booking/${examBooking._id}`);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 20,
      }}
    >
      <View className="items-center justify-center bg-bgPrimary">
        <LinearGradient
          colors={[colors.bgFourth, colors.bgSecondary]}
          style={{ width: "100%", gap: 12, paddingBottom: 20 }}
        >
          <View className="w-full gap-3 p-5">
            <HomeHeader user={user!} />
            {appointment && !appointment.finishedAt ? (
              <QueueDetails
                patientId={patientId!}
                professionalRoom={professional?.room}
                appointmentDateTime={appointment.dateTime}
              />
            ) : (
              patientId &&
              !isAppointmentsLoading && (
                <View className="w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-5">
                  <View className="items-center justify-center rounded-full bg-white/15 p-3">
                    <ListChecks size={22} color={colors.textPrimary} />
                  </View>
                  <View className="items-center gap-1">
                    <Text className="text-textPrimary font-semibold text-base">
                      Nenhuma fila ativa
                    </Text>
                    <Text className="text-textPrimary text-center text-sm opacity-70">
                      Agende uma consulta para acompanhar sua posição na fila
                      por aqui.
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => router.push("/explore")}
                    className="mt-1 rounded-full bg-white px-5 py-2"
                  >
                    <Text className="text-bgSecondary font-semibold text-sm">
                      Buscar atendimento
                    </Text>
                  </Pressable>
                </View>
              )
            )}
          </View>
        </LinearGradient>
        <View className="relative w-full mb-6">
          <View className="absolute -bottom-6 left-5 right-5">
            <SearchInput
              placeholder="Buscar clínica ou especialidade"
              onPress={() => router.push("/search")}
            />
          </View>
        </View>

        <View className="w-full p-5 gap-5">
          {!patient && (
            <View className="w-full rounded-[16px] border border-warningBorder bg-warningBg p-3">
              <Text className="text-sm font-medium text-warningText">
                Complete seu cadastro para agendar consultas e acessar todos os
                recursos.
              </Text>
            </View>
          )}
          {nextUpcomingVisit && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                nextUpcomingVisit.type === "exam"
                  ? "Ver informações do exame"
                  : "Ver informações da consulta"
              }
              onPress={handleUpcomingVisitPress}
              className="w-full flex-row items-center justify-between bg-bgSecondary px-3 py-3 rounded-lg"
            >
              <View className="flex-row gap-2 items-center flex-1 mr-2">
                {nextUpcomingVisit.type === "exam" ? (
                  <TestTube size={20} color={colors.textPrimary} />
                ) : (
                  <Bell size={20} color={colors.textPrimary} />
                )}
                <Text className="text-textPrimary flex-shrink">
                  {nextUpcomingVisit.type === "exam"
                    ? `Próximo exame: ${nextUpcomingVisit.examBooking.examOfferingName}`
                    : "Sua próxima consulta"}
                </Text>
              </View>
              <View className="flex-row gap-2 items-center flex-shrink-0">
                <Text className="text-textPrimary">
                  {nextUpcomingVisit.type === "exam"
                    ? formatExamDateTime(
                        nextUpcomingVisit.examBooking.scheduledAt,
                      )
                    : formatDateTime(appointment?.dateTime)}
                </Text>
                <Clock size={20} color={colors.textPrimary} />
              </View>
            </Pressable>
          )}
          <UpcomingVisits
            appointment={appointment}
            professional={professional}
            appointmentUnit={appointmentUnit}
            onPressAppointment={handlePressAppointment}
            examBookings={upcomingExamBookings}
            onPressExam={handlePressExam}
          />
          <QuickServices />
          <HealthUnits healthUnits={healthUnits} />
        </View>
      </View>
    </ScrollView>
  );
}
