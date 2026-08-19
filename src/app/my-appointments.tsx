import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
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
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { router } from "expo-router";
import { CalendarClock, MapPin, Stethoscope } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function MyAppointmentsScreen() {
  const colors = useThemeColors();

  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const {
    data: appointments,
    isLoading: isAppointmentsLoading,
    isError,
    refetch,
  } = useGetAppointmentsByPatientId(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const { data: patientQueueItems } = useGetQueueItemByPatientId(
    { patientId: patient?._id ?? "" },
    { enabled: Boolean(patient?._id) },
  );

  const { data: healthProfessionals } = useGetHealthProfessionals();
  const { data: healthUnits } = useGetHealthUnits();

  const isLoading = isAppointmentsLoading && Boolean(patient?._id);

  const upcomingAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((appointment) => appointment.status === EAppointmentStatus.SCHEDULED)
      .sort(
        (first, second) =>
          new Date(first.dateTime).getTime() - new Date(second.dateTime).getTime(),
      );
  }, [appointments]);

  const handleOpenQueue = (appointment: IAppointment) => {
    const queueItem = patientQueueItems?.find(
      (item) => item._id === appointment.queueItemId,
    );

    if (!queueItem) {
      Toast.show({
        type: "info",
        text1: "Fila ainda não disponível",
        text2: "A fila desta consulta será aberta no dia do atendimento.",
      });
      return;
    }

    router.push(`/queue-info/${queueItem.queueId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Minhas Consultas" />

      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <HistorySkeleton />
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-3">
            <Text className="text-center text-textFifth">
              Não foi possível carregar suas consultas.
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
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {upcomingAppointments.length === 0 ? (
              <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
                <Stethoscope size={28} color={colors.tabActive} />
                <Text className="mt-3 text-center text-textFifth">
                  Você não possui consultas agendadas.
                </Text>
              </View>
            ) : (
              upcomingAppointments.map((appointment) => {
                const professional = healthProfessionals?.find(
                  (item) => item._id === appointment.professionalId,
                );
                const unit = healthUnits?.find(
                  (item) => item._id === appointment.healthUnitId,
                );

                return (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    professional={professional}
                    unit={unit}
                    onPress={() => handleOpenQueue(appointment)}
                  />
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

interface AppointmentCardProps {
  appointment: IAppointment;
  professional?: IHealthProfessional;
  unit?: IHealthUnit;
  onPress: () => void;
}

function AppointmentCard({
  appointment,
  professional,
  unit,
  onPress,
}: AppointmentCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
    >
      <Text className="text-base font-semibold text-textBlack">
        {professional?.specialty || "Consulta"}
      </Text>
      {professional?.name && (
        <Text className="text-sm text-textFifth">{professional.name}</Text>
      )}

      <View className="mt-3 flex-row items-center gap-2">
        <CalendarClock size={14} color={colors.textFourth} />
        <Text className="text-xs text-textFourth">
          {formatDateTime(appointment.dateTime)}
        </Text>
      </View>

      {unit?.name && (
        <View className="mt-1 flex-row items-center gap-2">
          <MapPin size={14} color={colors.textFourth} />
          <Text className="text-xs text-textFourth" numberOfLines={1}>
            {unit.name}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
