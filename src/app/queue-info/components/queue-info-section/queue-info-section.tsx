import { useGetHealthProfessionalById } from "@/src/api/get-health-professional-by-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import {
  EQueueItemStatus,
  IQueueItem,
} from "@/src/config/entities/queue-items/queue-items.types";
import { IQueueWithDetails } from "@/src/config/entities/queue/queue.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { LinearGradient } from "expo-linear-gradient";
import {
  CalendarClock,
  Hash,
  MapPin,
  Megaphone,
  Phone,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  ITEM_STATUS_LABEL,
  QUEUE_SHIFT_LABEL,
  QUEUE_STATUS_LABEL,
} from "../../util";

interface QueueInfoSectionProps {
  queueItems?: IQueueItem[];
  queue: IQueueWithDetails;
  patientQueueItem?: IQueueItem | null;
  handleRefresh: () => void;
}

export default function QueueInfoSection({
  queueItems,
  queue,
  patientQueueItem,
  handleRefresh,
}: QueueInfoSectionProps) {
  const colors = useThemeColors();

  const { data: professional } = useGetHealthProfessionalById(
    { professionalId: queue?.professionalId ?? "" },
    { enabled: Boolean(queue?.professionalId) },
  );

  const { data: healthUnit } = useGetHealthUnitById(
    { healthUnitId: queue?.healthUnitId ?? "" },
    { enabled: Boolean(queue?.healthUnitId) },
  );

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

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <LinearGradient
        colors={[colors.bgFourth, colors.bgSecondary]}
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
            <RefreshCw size={18} color={colors.textPrimary} />
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
            <Megaphone size={16} color={colors.textPrimary} />
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
          <View className="rounded-2xl border border-borderPrimary bg-statusSuccessBg p-4">
            <Text className="font-bold text-statusSuccessText">
              É a sua vez! Dirija-se ao consultório
              {professional?.room ? ` ${professional.room}` : ""}.
            </Text>
          </View>
        )}

        <View className="flex-row gap-3">
          <View className="flex-1 gap-1 rounded-2xl border border-borderPrimary bg-bgThird p-4">
            <View className="flex-row items-center gap-2">
              <Users size={16} color={colors.textSecondary} />
              <Text className="text-xs text-textFifth">Aguardando</Text>
            </View>
            <Text className="text-2xl font-bold text-textBlack">
              {waitingItems?.length ?? 0}
            </Text>
          </View>
          <View className="flex-1 gap-1 rounded-2xl border border-borderPrimary bg-bgThird p-4">
            <View className="flex-row items-center gap-2">
              <CalendarClock size={16} color={colors.textSecondary} />
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
            <Hash size={18} color={colors.textSecondary} />
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
              <Stethoscope size={16} color={colors.textSecondary} />
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
              <MapPin size={16} color={colors.textSecondary} />
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
                <Phone size={14} color={colors.textFourth} />
                <Text className="text-xs text-textFourth">
                  {healthUnit.phone}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
