import {
  GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY,
  GET_APPOINTMENTS_BY_PATIENT_ID_KEY,
  useGetAppointmentsByPatientIdInfinite,
} from "@/src/api/get-appointment-by-patient-id";
import { useGetAppointmentRatingEligibility } from "@/src/api/get-appointment-rating-eligibility";
import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import { useClearAppointmentHistory } from "@/src/api/clear-appointment-history";
import { RatingModal } from "@/src/components/rating/rating-modal";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import { IAppointment, EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { flattenPaginatedPages } from "@/src/helpers/react-query/pagination";
import { formatDateTime } from "@/src/utils/format-date-time";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ArrowLeft,
  CalendarClock,
  History as HistoryIcon,
  MapPin,
  Star,
  Trash2,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HISTORY_STATUSES = [
  EAppointmentStatus.COMPLETED,
  EAppointmentStatus.CANCELED,
];

const STATUS_LABEL: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "Concluída",
  [EAppointmentStatus.CANCELED]: "Cancelada",
};

const STATUS_BG: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "bg-statusSuccessBg",
  [EAppointmentStatus.CANCELED]: "bg-statusDangerBg",
};

const STATUS_TEXT: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "text-statusSuccessText",
  [EAppointmentStatus.CANCELED]: "text-statusDangerText",
};

export default function HistoryScreen() {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const [ratingAppointmentId, setRatingAppointmentId] = useState<string | null>(null);

  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );

  const {
    data: appointmentsPages,
    isLoading: isAppointmentsLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAppointmentsByPatientIdInfinite(
    { patientId: patient?._id ?? "", status: HISTORY_STATUSES },
    { enabled: Boolean(patient?._id) },
  );

  const { data: healthProfessionals } = useGetHealthProfessionals();
  const { data: healthUnits } = useGetHealthUnits();

  const clearHistory = useClearAppointmentHistory();

  const history = flattenPaginatedPages(appointmentsPages);

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
                  queryClient.invalidateQueries({
                    queryKey: [GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY],
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
            <ArrowLeft size={24} color={colors.textSecondary} />
          </Pressable>
          <Text className="text-xl font-semibold text-textBlack">
            Histórico
          </Text>
        </View>
      </View>

      {isLoading ? (
        <HistorySkeleton />
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
        <FlatList
          className="flex-1"
          showsVerticalScrollIndicator={false}
          data={history}
          keyExtractor={(appointment) => appointment._id}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          renderItem={({ item: appointment }) => {
            const professional = healthProfessionals?.find(
              (item) => item._id === appointment.professionalId,
            );
            const unit = healthUnits?.find(
              (item) => item._id === appointment.healthUnitId,
            );

            return (
              <HistoryAppointmentCard
                appointment={appointment}
                professional={professional}
                unit={unit}
                onRate={() => setRatingAppointmentId(appointment._id)}
              />
            );
          }}
          ListEmptyComponent={
            <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
              <HistoryIcon size={28} color={colors.tabActive} />
              <Text className="mt-3 text-center text-textFifth">
                Você ainda não possui consultas no histórico.
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="items-center py-4">
                <ActivityIndicator color={colors.textSecondary} />
              </View>
            ) : null
          }
        />
      )}

      {history.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpar histórico"
          disabled={clearHistory.isPending}
          onPress={handleClearHistory}
          className="mb-4 mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-borderPrimary py-3"
        >
          <Trash2 size={16} color={colors.textDanger} />
          <Text className="font-semibold text-textDanger">
            {clearHistory.isPending ? "Limpando..." : "Limpar histórico"}
          </Text>
        </Pressable>
      )}

      <RatingModal
        appointmentId={ratingAppointmentId}
        visible={Boolean(ratingAppointmentId)}
        onClose={() => setRatingAppointmentId(null)}
      />
    </SafeAreaView>
  );
}

interface HistoryAppointmentCardProps {
  appointment: IAppointment;
  professional?: IHealthProfessional;
  unit?: IHealthUnit;
  onRate: () => void;
}

function HistoryAppointmentCard({
  appointment,
  professional,
  unit,
  onRate,
}: HistoryAppointmentCardProps) {
  const { data: eligibility } = useGetAppointmentRatingEligibility(
    { appointmentId: appointment._id },
    { enabled: appointment.status === EAppointmentStatus.COMPLETED },
  );

  const canRate = Boolean(eligibility?.canRateProfessional || eligibility?.canRateClinic);
  const colors = useThemeColors();

  return (
    <View className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-textBlack">
            {professional?.specialty || "Consulta"}
          </Text>
          {professional?.name && (
            <Text className="text-sm text-textFifth">{professional.name}</Text>
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

      {canRate && (
        <Pressable
          accessibilityRole="button"
          onPress={onRate}
          className="mt-3 flex-row items-center justify-center gap-2 self-start rounded-full bg-bgSecondary px-4 py-2"
        >
          <Star size={14} color={colors.textPrimary} fill={colors.textPrimary} />
          <Text className="text-xs font-semibold text-textPrimary">
            Avaliar atendimento
          </Text>
        </Pressable>
      )}
    </View>
  );
}
