import {
  GET_APPOINTMENTS_BY_PATIENT_ID_KEY,
  useGetAppointmentsByPatientId,
} from "@/src/api/get-appointment-by-patient-id";
import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import { useClearAppointmentHistory } from "@/src/api/clear-appointment-history";
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import { formatDateTime } from "@/src/utils/format-date-time";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ArrowLeft,
  CalendarClock,
  History as HistoryIcon,
  MapPin,
  Trash2,
} from "lucide-react-native";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_LABEL: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "Concluída",
  [EAppointmentStatus.CANCELED]: "Cancelada",
};

const STATUS_BG: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "bg-[#E6F7EF]",
  [EAppointmentStatus.CANCELED]: "bg-[#FDEAEA]",
};

const STATUS_TEXT: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "text-[#0F9D58]",
  [EAppointmentStatus.CANCELED]: "text-[#BA1A1A]",
};

export default function HistoryScreen() {
  const queryClient = useQueryClient();

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

  const { data: healthProfessionals } = useGetHealthProfessionals();
  const { data: healthUnits } = useGetHealthUnits();

  const clearHistory = useClearAppointmentHistory();

  const history = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter(
        (appointment) =>
          appointment.status === EAppointmentStatus.COMPLETED ||
          appointment.status === EAppointmentStatus.CANCELED,
      )
      .sort(
        (first, second) =>
          new Date(second.dateTime).getTime() -
          new Date(first.dateTime).getTime(),
      );
  }, [appointments]);

  const isLoading = isAppointmentsLoading && Boolean(patient?._id);

  const handleClearHistory = () => {
    if (!patient?._id) return;

    Alert.alert(
      "Limpar histórico",
      "Tem certeza que deseja apagar todo o seu histórico de consultas? Essa ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => {
            clearHistory.mutate(
              { patientId: patient._id },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: [GET_APPOINTMENTS_BY_PATIENT_ID_KEY],
                  });
                },
              },
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary px-4 pt-4">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#006673" />
          </Pressable>
          <Text className="text-xl font-semibold text-textBlack">
            Histórico
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="#008096" />
          <Text className="text-textFifth">Carregando histórico...</Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-center text-textFifth">
            Não foi possível carregar seu histórico.
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
          {history.length === 0 ? (
            <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
              <HistoryIcon size={28} color="#0F766E" />
              <Text className="mt-3 text-center text-textFifth">
                Você ainda não possui consultas no histórico.
              </Text>
            </View>
          ) : (
            history.map((appointment) => {
              const professional = healthProfessionals?.find(
                (item) => item._id === appointment.professionalId,
              );
              const unit = healthUnits?.find(
                (item) => item._id === appointment.healthUnitId,
              );

              return (
                <View
                  key={appointment._id}
                  className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-textBlack">
                        {professional?.specialty || "Consulta"}
                      </Text>
                      {professional?.name && (
                        <Text className="text-sm text-textFifth">
                          {professional.name}
                        </Text>
                      )}
                    </View>
                    <View
                      className={`rounded-full px-3 py-1 ${
                        STATUS_BG[appointment.status] ?? "bg-bgPrimary"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          STATUS_TEXT[appointment.status] ?? "text-textFifth"
                        }`}
                      >
                        {STATUS_LABEL[appointment.status] ?? appointment.status}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-3 flex-row items-center gap-2">
                    <CalendarClock size={14} color="#A8A8A8" />
                    <Text className="text-xs text-textFourth">
                      {formatDateTime(appointment.dateTime)}
                    </Text>
                  </View>

                  {unit?.name && (
                    <View className="mt-1 flex-row items-center gap-2">
                      <MapPin size={14} color="#A8A8A8" />
                      <Text className="text-xs text-textFourth" numberOfLines={1}>
                        {unit.name}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {history.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpar histórico"
          disabled={clearHistory.isPending}
          onPress={handleClearHistory}
          className="mb-4 mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-borderPrimary py-3"
        >
          <Trash2 size={16} color="#B91C1C" />
          <Text className="font-semibold text-textDanger">
            {clearHistory.isPending ? "Limpando..." : "Limpar histórico"}
          </Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}
