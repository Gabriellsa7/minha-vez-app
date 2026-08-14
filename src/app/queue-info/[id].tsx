import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetHealthProfessionalById } from "@/src/api/get-health-professional-by-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetQueueItemByPatientId } from "@/src/api/get-queue-item-by-patient-id";
import { useGetQueueItemByQueueId } from "@/src/api/get-queue-item-by-queue-id";
import { useGetQueuesWithDetailsByPatientId } from "@/src/api/get-queues-with-details-by-patient-id";
import { useGetUser } from "@/src/api/get-user-me";
import { QueueInfoSkeleton } from "@/src/components/skeletons/queue-info-skeleton";
import { RatingModal } from "@/src/components/rating/rating-modal";
import { CancelAppointmentModal } from "@/src/components/cancel-appointment/cancel-appointment-modal";
import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";
import { EQueueShift, EQueueStatus } from "@/src/config/entities/queue/queue.type";
import { EQueueItemStatus } from "@/src/config/entities/queue-items/queue-items.types";
import { formatDateTime } from "@/src/utils/format-date-time";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CalendarClock,
  Hash,
  MapPin,
  Megaphone,
  Phone,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUEUE_STATUS_LABEL: Record<EQueueStatus, string> = {
  [EQueueStatus.OPEN]: "Aberta",
  [EQueueStatus.IN_PROGRESS]: "Em andamento",
  [EQueueStatus.CLOSED]: "Fechada",
};

const QUEUE_SHIFT_LABEL: Record<EQueueShift, string> = {
  [EQueueShift.MORNING]: "Manhã",
  [EQueueShift.AFTERNOON]: "Tarde",
};

const ITEM_STATUS_LABEL: Record<EQueueItemStatus, string> = {
  [EQueueItemStatus.WAITING]: "Aguardando",
  [EQueueItemStatus.IN_SERVICE]: "Em atendimento",
  [EQueueItemStatus.FINISHED]: "Finalizado",
  [EQueueItemStatus.ABSENT]: "Ausente",
};

export default function QueueInfoScreen() {
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

  const { data: professional } = useGetHealthProfessionalById(
    { professionalId: queue?.professionalId ?? "" },
    { enabled: Boolean(queue?.professionalId) },
  );

  const { data: healthUnit } = useGetHealthUnitById(
    { healthUnitId: queue?.healthUnitId ?? "" },
    { enabled: Boolean(queue?.healthUnitId) },
  );

  const isLoading = isQueueLoading || isQueueItemsLoading;
  const isError = isQueueError || isQueueItemsError;

  const handleRefresh = () => {
    refetchQueue();
    refetchQueueItems();
  };

  const waitingItems = queueItems?.filter(
    (item) => item.status === EQueueItemStatus.WAITING,
  );
  const inServiceItem = queueItems?.find(
    (item) => item.status === EQueueItemStatus.IN_SERVICE,
  );
  const finishedCount =
    queueItems?.filter((item) => item.status === EQueueItemStatus.FINISHED)
      .length ?? 0;
  const absentCount =
    queueItems?.filter((item) => item.status === EQueueItemStatus.ABSENT)
      .length ?? 0;

  const isMyTurn = patientQueueItem?.status === EQueueItemStatus.IN_SERVICE;
  const estimatedWaitMinutes = queue?.estimatedWaitMinutes ?? null;

  const [ratingAppointmentId, setRatingAppointmentId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const previousQueueItemStatusRef = useRef<EQueueItemStatus | undefined>(undefined);

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
          <ArrowLeft size={24} color="#006673" />
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
            <RefreshCw size={16} color="#FFFFFF" />
            <Text className="font-bold text-textPrimary">Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <LinearGradient
            colors={["#006579", "#008096"]}
            style={{ paddingHorizontal: 20, paddingVertical: 24, gap: 16 }}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold uppercase tracking-wider text-textPrimary opacity-70">
                Status em tempo real
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Atualizar"
                hitSlop={8}
                onPress={handleRefresh}
              >
                <RefreshCw size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            <Text className="text-2xl font-bold text-textPrimary">
              {queue.healthUnitName}
            </Text>

            <View className="flex-row flex-wrap gap-2">
              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-xs font-semibold text-textPrimary">
                  {QUEUE_STATUS_LABEL[queue.status] ?? queue.status}
                </Text>
              </View>
              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-xs font-semibold text-textPrimary">
                  Turno: {QUEUE_SHIFT_LABEL[queue.shift] ?? queue.shift}
                </Text>
              </View>
              <View className="rounded-full bg-white/15 px-3 py-1">
                <Text className="text-xs font-semibold text-textPrimary">
                  {formatDateTime(queue.queueDate)}
                </Text>
              </View>
            </View>

            <View className="items-center gap-3 py-4">
              <View className="rounded-full bg-white px-4 py-1">
                <Text className="text-xs font-bold text-bgSecondary">
                  {isMyTurn ? "SUA VEZ" : "SUA POSIÇÃO"}
                </Text>
              </View>
              <View className="h-32 w-32 items-center justify-center rounded-full border-4 border-white/40 bg-white/10">
                <Text className="text-5xl font-bold text-textPrimary">
                  {isMyTurn
                    ? "😀"
                    : patientQueueItem?.status === EQueueItemStatus.WAITING
                      ? patientQueueItem.position
                      : "—"}
                </Text>
              </View>
              <Text className="text-textPrimary opacity-80">
                {patientQueueItem
                  ? ITEM_STATUS_LABEL[patientQueueItem.status]
                  : "Sem informações da sua senha"}
                {patientQueueItem?.code ? ` · Senha #${patientQueueItem.code}` : ""}
              </Text>
              <View className="flex-row items-center gap-2">
                <Megaphone size={16} color="#FFFFFF" />
                <Text className="text-textPrimary">
                  {inServiceItem
                    ? `Chamando senha #${inServiceItem.code}`
                    : "Ninguém sendo chamado no momento"}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View className="gap-4 p-5">
            {isMyTurn && (
              <View className="rounded-2xl border border-borderPrimary bg-[#E6F7EF] p-4">
                <Text className="font-bold text-[#0F9D58]">
                  É a sua vez! Dirija-se ao consultório
                  {professional?.room ? ` ${professional.room}` : ""}.
                </Text>
              </View>
            )}

            <View className="flex-row gap-3">
              <View className="flex-1 gap-1 rounded-2xl border border-borderPrimary bg-bgThird p-4">
                <View className="flex-row items-center gap-2">
                  <Users size={16} color="#006673" />
                  <Text className="text-xs text-textFifth">Aguardando</Text>
                </View>
                <Text className="text-2xl font-bold text-textBlack">
                  {waitingItems?.length ?? 0}
                </Text>
              </View>
              <View className="flex-1 gap-1 rounded-2xl border border-borderPrimary bg-bgThird p-4">
                <View className="flex-row items-center gap-2">
                  <CalendarClock size={16} color="#006673" />
                  <Text className="text-xs text-textFifth">Espera estimada</Text>
                </View>
                <Text className="text-2xl font-bold text-textBlack">
                  {isMyTurn
                    ? "Agora"
                    : estimatedWaitMinutes !== null
                      ? `${estimatedWaitMinutes} min`
                      : "N/A"}
                </Text>
              </View>
            </View>

            <View className="rounded-2xl border border-borderPrimary bg-bgThird p-4">
              <Text className="mb-3 text-sm font-semibold text-textBlack">
                Andamento da fila
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-textBlack">
                    {queueItems?.length ?? 0}
                  </Text>
                  <Text className="text-xs text-textFourth">Total</Text>
                </View>
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-textBlack">
                    {waitingItems?.length ?? 0}
                  </Text>
                  <Text className="text-xs text-textFourth">Aguardando</Text>
                </View>
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-textBlack">
                    {inServiceItem ? 1 : 0}
                  </Text>
                  <Text className="text-xs text-textFourth">Em atendimento</Text>
                </View>
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-textBlack">
                    {finishedCount}
                  </Text>
                  <Text className="text-xs text-textFourth">Finalizados</Text>
                </View>
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-textBlack">
                    {absentCount}
                  </Text>
                  <Text className="text-xs text-textFourth">Ausentes</Text>
                </View>
              </View>
            </View>

            {patientQueueItem?.code && (
              <View className="flex-row items-center gap-3 rounded-2xl border border-borderPrimary bg-bgThird p-4">
                <Hash size={18} color="#006673" />
                <View>
                  <Text className="text-xs text-textFifth">Sua senha</Text>
                  <Text className="text-lg font-bold text-textBlack">
                    #{patientQueueItem.code}
                  </Text>
                </View>
              </View>
            )}

            {professional && (
              <View className="gap-2 rounded-2xl border border-borderPrimary bg-bgThird p-4">
                <View className="flex-row items-center gap-2">
                  <Stethoscope size={16} color="#006673" />
                  <Text className="text-sm font-semibold text-textBlack">
                    Profissional
                  </Text>
                </View>
                <Text className="text-base font-semibold text-textBlack">
                  {professional.name}
                </Text>
                <Text className="text-sm text-textFifth">
                  {professional.specialty}
                  {professional.room ? ` · Sala ${professional.room}` : ""}
                </Text>
              </View>
            )}

            {healthUnit && (
              <View className="gap-2 rounded-2xl border border-borderPrimary bg-bgThird p-4">
                <View className="flex-row items-center gap-2">
                  <MapPin size={16} color="#006673" />
                  <Text className="text-sm font-semibold text-textBlack">
                    {healthUnit.name}
                  </Text>
                </View>
                <Text className="text-sm text-textFifth">
                  {healthUnit.address.street}, {healthUnit.address.number}
                  {healthUnit.address.complement
                    ? ` - ${healthUnit.address.complement}`
                    : ""}
                  {"\n"}
                  {healthUnit.address.neighborhood} · {healthUnit.address.city}/
                  {healthUnit.address.state}
                </Text>
                {healthUnit.phone && (
                  <View className="mt-1 flex-row items-center gap-2">
                    <Phone size={14} color="#A8A8A8" />
                    <Text className="text-xs text-textFourth">
                      {healthUnit.phone}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {!isLoading && !isError && queue && canCancelAppointment && (
        <View className="border-t border-borderPrimary bg-bgPrimary px-5 py-4">
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsCancelModalOpen(true)}
            className="items-center rounded-xl bg-[#BA1A1A] py-3"
          >
            <Text className="font-bold text-white">Cancelar consulta</Text>
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
