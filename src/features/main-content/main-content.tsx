import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetExamBookingsByPatientId } from "@/src/api/get-exam-bookings-by-patient-id";
import { useGetHealthProfessionalByAppointmentId } from "@/src/api/get-health-professional-by-appointment-id";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import SearchInput from "@/src/components/search-input/search-input";
import {
  EExamBookingStatus,
  IExamBooking,
} from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import { IPatient } from "@/src/config/entities/patients/patients.type";
import { IUser } from "@/src/config/entities/user/user.types";
import { formatDateTime } from "@/src/utils/format-date-time";
import { formatExamDateTime } from "@/src/utils/exam-scheduling.util";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Bell, Clock, ListChecks, TestTube } from "lucide-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import HomeHeader from "./componentes/header/header";
import HealthUnits from "./componentes/health-units/health-units";
import QueueDetails from "./componentes/queue-details/queue-details";
import { QuickServices } from "./componentes/quick-services/quick-services";

interface MainContentProps {
  user: IUser;
  patient?: IPatient | null;
}

export default function MainContent({ user, patient }: MainContentProps) {
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

  const nextExamBooking = useMemo(() => {
    const now = new Date();

    return examBookings
      ?.filter(
        (booking) =>
          (booking.status === EExamBookingStatus.SCHEDULED ||
            booking.status === EExamBookingStatus.CONFIRMED) &&
          new Date(booking.scheduledAt) > now,
      )
      .sort(
        (first, second) =>
          new Date(first.scheduledAt).getTime() -
          new Date(second.scheduledAt).getTime(),
      )[0];
  }, [examBookings]);

  // The home screen surfaces whichever is soonest — a consulta or an exame
  // agendado — since a patient can have either (or both) coming up, and the
  // banner must say which one it is instead of always calling it a "exame".
  const nextUpcomingVisit = useMemo(() => {
    const appointmentDate =
      appointment && !appointment.finishedAt
        ? new Date(appointment.dateTime)
        : null;
    const examDate = nextExamBooking
      ? new Date(nextExamBooking.scheduledAt)
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

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 20,
      }}
    >
      <View className="items-center justify-center bg-bgPrimary">
        <LinearGradient
          colors={["#006579", "#008096"]}
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
                    <ListChecks size={22} color="#FFFFFF" />
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
            <View className="w-full rounded-[16px] border border-[#FDE68A] bg-[#FEF3C7] p-3">
              <Text className="text-sm font-medium text-[#92400E]">
                Complete seu cadastro para agendar consultas e acessar todos os
                recursos.
              </Text>
            </View>
          )}
          {nextUpcomingVisit && (
            <View className="w-full flex-row items-center justify-between bg-[#008096] px-3 py-3 rounded-lg">
              <View className="flex-row gap-2 items-center">
                {nextUpcomingVisit.type === "exam" ? (
                  <TestTube size={20} color="#FFFFFF" />
                ) : (
                  <Bell size={20} color="#FFFFFF" />
                )}
                <Text className=" text-textPrimary">
                  {nextUpcomingVisit.type === "exam"
                    ? `Próximo exame: ${nextUpcomingVisit.examBooking.examOfferingName}`
                    : "Sua próxima consulta"}
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <Text className="text-textPrimary">
                  {nextUpcomingVisit.type === "exam"
                    ? formatExamDateTime(nextUpcomingVisit.examBooking.scheduledAt)
                    : formatDateTime(appointment?.dateTime)}
                </Text>
                <Clock size={20} color="#FFFFFF" />
              </View>
            </View>
          )}
          <QuickServices />
          <HealthUnits healthUnits={healthUnits} />
        </View>
      </View>
    </ScrollView>
  );
}
