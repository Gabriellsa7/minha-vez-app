import { useClearAppointmentHistory } from "@/src/api/clear-appointment-history";
import {
  GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY,
  GET_APPOINTMENTS_BY_PATIENT_ID_KEY,
  useGetAppointmentsByPatientIdInfinite,
} from "@/src/api/get-appointment-by-patient-id";
import { useGetHealthProfessionals } from "@/src/api/get-health-professionals";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import { RatingModal } from "@/src/components/rating/rating-modal";
import { HistorySkeleton } from "@/src/components/skeletons/history-skeleton";
import { flattenPaginatedPages } from "@/src/helpers/react-query/pagination";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowLeft, History as HistoryIcon, Trash2 } from "lucide-react-native";
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
import HistoryAppointmentCard from "./components/history-appointment-card/history-appointment-card";
import { HISTORY_STATUSES } from "./util";

export default function HistoryScreen() {
  const colors = useThemeColors();
  const queryClient = useQueryClient();
  const [ratingAppointmentId, setRatingAppointmentId] = useState<string | null>(
    null,
  );

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
            <Text className="font-bold text-textPrimary">Tentar novamente</Text>
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
