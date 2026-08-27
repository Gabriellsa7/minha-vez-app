import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetQueueItemByPatientId } from "@/src/api/get-queue-item-by-patient-id";
import { useGetQueueItemByQueueId } from "@/src/api/get-queue-item-by-queue-id";
import { useGetQueuesWithDetailsByPatientId } from "@/src/api/get-queues-with-details-by-patient-id";
import { useGetUser } from "@/src/api/get-user-me";
import { CancelAppointmentModal } from "@/src/components/cancel-appointment/cancel-appointment-modal";
import { RatingModal } from "@/src/components/rating/rating-modal";
import { QueueInfoSkeleton } from "@/src/components/skeletons/queue-info-skeleton";
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import { EQueueItemStatus } from "@/src/config/entities/queue-items/queue-items.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, RefreshCw } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QueueInfoSection from "./components/queue-info-section/queue-info-section";

export default function QueueInfoScreen() {
  const colors = useThemeColors();
  const { id: queueId } = useLocalSearchParams<{ id: string }>();

  const { data: user } = useGetUser();
  const { data: patient } = useGetPatientById(
    { userId: user?._id ?? "" },
    { enabled: Boolean(user?._id) },
  );
  const patientId = patient?._id;

  const {
    data: queuesWithDetails,
    isLoading: isQueueLoading,
    isError: isQueueError,
    refetch: refetchQueue,
  } = useGetQueuesWithDetailsByPatientId(
    { patientId: patientId ?? "" },
    { enabled: Boolean(patientId) },
  );

  const { data: patientQueueItems } = useGetQueueItemByPatientId(
    { patientId: patientId ?? "" },
    { enabled: Boolean(patientId), refetchInterval: 5000 },
  );

  const { data: patientAppointments } = useGetAppointmentsByPatientId(
    { patientId: patientId ?? "" },
    { enabled: Boolean(patientId) },
  );

  const {
    data: queueItems,
    isLoading: isQueueItemsLoading,
    isError: isQueueItemsError,
    refetch: refetchQueueItems,
  } = useGetQueueItemByQueueId(
    { queueId: queueId ?? "" },
    { enabled: Boolean(queueId) },
  );

  const queue = queuesWithDetails?.find((item) => item._id === queueId);
  const patientQueueItem = patientQueueItems?.find(
    (item) => item.queueId === queueId,
  );

  const isLoading = isQueueLoading || isQueueItemsLoading;
  const isError = isQueueError || isQueueItemsError;

  const handleRefresh = () => {
    refetchQueue();
    refetchQueueItems();
  };

  const [ratingAppointmentId, setRatingAppointmentId] = useState<string | null>(
    null,
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const previousQueueItemStatusRef = useRef<EQueueItemStatus | undefined>(
    undefined,
  );

  const currentAppointment = patientAppointments?.find(
    (appointment) =>
      appointment.queueItemId === patientQueueItem?._id &&
      appointment.status === EAppointmentStatus.SCHEDULED,
  );

  const canCancelAppointment = (() => {
    if (!currentAppointment) return false;

    const cutoff = new Date(currentAppointment.dateTime);
    cutoff.setDate(cutoff.getDate() - 1);
    cutoff.setHours(12, 0, 0, 0);

    return new Date() < cutoff;
  })();

  useEffect(() => {
    const currentStatus = patientQueueItem?.status;
    const previousStatus = previousQueueItemStatusRef.current;

    if (
      currentStatus === EQueueItemStatus.FINISHED &&
      previousStatus !== undefined &&
      previousStatus !== EQueueItemStatus.FINISHED
    ) {
      const completedAppointment = patientAppointments?.find(
        (appointment) =>
          appointment.queueItemId === patientQueueItem?._id &&
          appointment.status === EAppointmentStatus.COMPLETED,
      );

      if (completedAppointment) {
        setRatingAppointmentId(completedAppointment._id);
      }
    }

    previousQueueItemStatusRef.current = currentStatus;
  }, [patientQueueItem?.status, patientQueueItem?._id, patientAppointments]);

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-4 pt-2 pb-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={8}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.textSecondary} />
        </Pressable>
        <Text className="text-xl font-semibold text-textBlack">Fila</Text>
      </View>

      {isLoading ? (
        <QueueInfoSkeleton />
      ) : isError || !queue ? (
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <Text className="text-center text-textFifth">
            Não foi possível carregar as informações da fila.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleRefresh}
            className="flex-row items-center gap-2 rounded-lg bg-bgSecondary px-4 py-3"
          >
            <RefreshCw size={16} color={colors.textPrimary} />
            <Text className="font-bold text-textPrimary">Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <QueueInfoSection
          queueItems={queueItems}
          queue={queue}
          patientQueueItem={patientQueueItem}
          handleRefresh={handleRefresh}
        />
      )}

      {!isLoading && !isError && queue && canCancelAppointment && (
        <View className="border-t border-borderPrimary bg-bgPrimary px-5 py-4">
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsCancelModalOpen(true)}
            className="items-center rounded-xl bg-statusDangerText py-3"
          >
            <Text className="font-bold text-textPrimary">
              Cancelar consulta
            </Text>
          </Pressable>
        </View>
      )}

      <RatingModal
        appointmentId={ratingAppointmentId}
        visible={Boolean(ratingAppointmentId)}
        onClose={() => setRatingAppointmentId(null)}
      />

      <CancelAppointmentModal
        appointmentId={currentAppointment?._id ?? null}
        visible={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onCanceled={() => router.replace("/home")}
      />
    </SafeAreaView>
  );
}
