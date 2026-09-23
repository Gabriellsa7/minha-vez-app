import {
  EQueueItemStatus,
  IQueueItem,
} from "@/src/config/entities/queue-items/queue-items.types";
import { IQueueWithDetails } from "@/src/config/entities/queue/queue.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { LinearGradient } from "expo-linear-gradient";
import { Megaphone, RefreshCw } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import {
  ITEM_STATUS_LABEL,
  QUEUE_SHIFT_LABEL,
  QUEUE_STATUS_LABEL,
} from "../queue-info.util";

interface QueueHeroProps {
  queue: IQueueWithDetails;
  patientQueueItem?: IQueueItem | null;
  inServiceItem?: IQueueItem;
  onRefresh: () => void;
}

function Chip({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-white/15 px-3 py-1">
      <Text className="text-xs font-semibold text-textPrimary">{label}</Text>
    </View>
  );
}

const getPositionLabel = (patientQueueItem?: IQueueItem | null) => {
  if (patientQueueItem?.status === EQueueItemStatus.IN_SERVICE) return "😀";
  if (patientQueueItem?.status !== EQueueItemStatus.WAITING) return "—";
  return patientQueueItem.position ?? "⏳";
};

export function QueueHero({
  queue,
  patientQueueItem,
  inServiceItem,
  onRefresh,
}: QueueHeroProps) {
  const colors = useThemeColors();

  const isMyTurn = patientQueueItem?.status === EQueueItemStatus.IN_SERVICE;
  const isWaitingWithoutPosition =
    patientQueueItem?.status === EQueueItemStatus.WAITING &&
    patientQueueItem.position == null;

  return (
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
          hitSlop={12}
          onPress={onRefresh}
        >
          <RefreshCw size={18} color={colors.textPrimary} />
        </Pressable>
      </View>

      <Text className="text-2xl font-bold text-textPrimary">
        {queue.healthUnitName}
      </Text>

      <View className="flex-row flex-wrap gap-2">
        <Chip label={QUEUE_STATUS_LABEL[queue.status] ?? queue.status} />
        <Chip label={`Turno: ${QUEUE_SHIFT_LABEL[queue.shift] ?? queue.shift}`} />
        <Chip label={formatDateTime(queue.queueDate)} />
      </View>

      <View className="items-center gap-3 py-4">
        <View className="rounded-full bg-white px-4 py-1">
          <Text className="text-xs font-bold text-bgSecondary">
            {isMyTurn ? "SUA VEZ" : "SUA POSIÇÃO"}
          </Text>
        </View>
        <View className="h-32 w-32 items-center justify-center rounded-full border-4 border-white/40 bg-white/10">
          <Text
            className={`font-bold text-textPrimary ${
              isWaitingWithoutPosition ? "text-3xl" : "text-5xl"
            }`}
          >
            {getPositionLabel(patientQueueItem)}
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
  );
}
