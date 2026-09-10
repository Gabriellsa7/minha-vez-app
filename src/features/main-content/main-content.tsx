import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetExamBookingsByPatientId } from "@/src/api/get-exam-bookings-by-patient-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetQueueItemByPatientId } from "@/src/api/get-queue-item-by-patient-id";
import SearchInput from "@/src/components/search-input/search-input";
import {
  EAppointmentStatus,
  IAppointment,
} from "@/src/config/entities/appointments/appointments.types";
import {
  EExamBookingStatus,
  IExamBooking,
} from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { IPatient } from "@/src/config/entities/patients/patients.type";
import { EQueueItemStatus } from "@/src/config/entities/queue-items/queue-items.types";
import { IUser } from "@/src/config/entities/user/user.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  formatExamDateTime,
  getExamComparableDate,
} from "@/src/utils/exam-scheduling.util";
import { formatDateTime } from "@/src/utils/format-date-time";
import { CHECK_IN_GRACE_MS } from "@/src/utils/visit-urgency";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import {
  Bell,
  Clock,
  HeartPulse,
  ListChecks,
  TestTube,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
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

const MEDICAL_INFO_REMINDER_DELAY_MS = 3 * 24 * 60 * 60 * 1000;

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

        refetchInterval: 5000,
      },
    );

  const upcomingAppointments = useMemo(() => {
    const now = new Date();

    return (
      userAppointments
        ?.filter((item) => {
          if (item.status !== EAppointmentStatus.SCHEDULED) return false;

          const cutoffMs = item.checkInAt
            ? new Date(item.dateTime).getTime()
            : new Date(item.dateTime).getTime() + CHECK_IN_GRACE_MS;
          return cutoffMs > now.getTime();
        })
        .sort(
          (first, second) =>
            new Date(first.dateTime).getTime() -
            new Date(second.dateTime).getTime(),
        ) ?? []
    );
  }, [userAppointments]);

  const appointment = upcomingAppointments[0];

  const hasScheduledAppointment = useMemo(
    () =>
      userAppointments?.some(
        (item) => item.status === EAppointmentStatus.SCHEDULED,
      ) ?? false,
    [userAppointments],
  );

  if (isAppointmentsLoading) {
    console.log("Carregando appointments...");
  }

  const { data: examBookings } = useGetExamBookingsByPatientId(
    { patientId: patientId || "" },
    { enabled: !!patientId },
  );

  const { data: queueItems } = useGetQueueItemByPatientId(
    { patientId: patientId || "" },
    { enabled: !!patientId, refetchInterval: 5000 },
  );

  const hasRevealedActiveQueueItem = useMemo(
    () =>
      queueItems?.some(
        (item) =>
          item.status === EQueueItemStatus.IN_SERVICE ||
          (item.status === EQueueItemStatus.WAITING && item.position != null),
      ) ?? false,
    [queueItems],
  );

  const { data: appointmentHealthUnit } = useGetHealthUnitById(
    { healthUnitId: appointment?.healthUnitId ?? "" },
    { enabled: Boolean(appointment?.healthUnitId) },
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

  const [needsMedicalInfoReminder, setNeedsMedicalInfoReminder] =
    useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!patient) {
        setNeedsMedicalInfoReminder(false);
        return;
      }

      const hasFilledMedicalInfo =
        Boolean(patient.bloodType) ||
        Boolean(patient.allergies?.trim()) ||
        Boolean(patient.medicalObservations?.trim());

      if (hasFilledMedicalInfo) {
        setNeedsMedicalInfoReminder(false);
        return;
      }

      const registeredAt = new Date(patient.createdAt).getTime();
      setNeedsMedicalInfoReminder(
        Date.now() - registeredAt >= MEDICAL_INFO_REMINDER_DELAY_MS,
      );
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [patient]);

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
            {hasRevealedActiveQueueItem ? (
              <QueueDetails patientId={patientId!} />
            ) : hasScheduledAppointment && appointment ? (
              <View className="w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-5">
                <View className="items-center justify-center rounded-full bg-white/15 p-3">
                  <Clock size={22} color={colors.textPrimary} />
                </View>
                <View className="items-center gap-1">
                  <Text className="text-textPrimary font-semibold text-base">
                    Sua consulta está agendada
                  </Text>
                  <Text className="text-textPrimary text-center text-sm opacity-70">
                    {appointmentHealthUnit?.name
                      ? `${appointmentHealthUnit.name} · `
                      : ""}
                    {formatDateTime(appointment.dateTime)}
                  </Text>
                  <Text className="text-textPrimary text-center text-sm opacity-70">
                    A fila será aberta e sua posição calculada quando faltarem 2
                    horas para o horário marcado.
                  </Text>
                </View>
              </View>
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
          {needsMedicalInfoReminder && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Preencher dados de saúde"
              onPress={() => router.push("/medical-info")}
              className="w-full flex-row gap-3 rounded-[16px] border border-warningBorder bg-warningBg p-3 items-center"
            >
              <HeartPulse size={20} color={colors.warningText} />
              <Text className="flex-1 text-sm font-medium text-warningText">
                Complete seus dados de saúde (tipo sanguíneo, alergias e
                observações médicas). Eles são importantes para o seu
                atendimento.
              </Text>
            </Pressable>
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
            appointments={upcomingAppointments}
            healthUnits={healthUnits}
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
