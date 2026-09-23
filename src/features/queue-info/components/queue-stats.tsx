import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { CalendarClock, LucideIcon, Users } from "lucide-react-native";
import { Text, View } from "react-native";

export interface QueueCounts {
  total: number;
  waiting: number;
  inService: number;
  finished: number;
  absent: number;
}

interface QueueStatsProps {
  counts: QueueCounts;
  estimatedWaitLabel: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  const colors = useThemeColors();

  return (
    <View className="flex-1 gap-1 rounded-2xl border border-borderPrimary bg-bgThird p-4">
      <View className="flex-row items-center gap-2">
        <Icon size={16} color={colors.textSecondary} />
        <Text className="text-xs text-textFifth">{label}</Text>
      </View>
      <Text className="text-2xl font-bold text-textBlack">{value}</Text>
    </View>
  );
}

function ProgressItem({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center gap-1">
      <Text className="text-lg font-bold text-textBlack">{value}</Text>
      <Text className="text-xs text-textFourth">{label}</Text>
    </View>
  );
}

export function QueueStats({ counts, estimatedWaitLabel }: QueueStatsProps) {
  return (
    <>
      <View className="flex-row gap-3">
        <StatCard icon={Users} label="Aguardando" value={counts.waiting} />
        <StatCard
          icon={CalendarClock}
          label="Espera estimada"
          value={estimatedWaitLabel}
        />
      </View>

      <View className="rounded-2xl border border-borderPrimary bg-bgThird p-4">
        <Text className="mb-3 text-sm font-semibold text-textBlack">
          Andamento da fila
        </Text>
        <View className="flex-row justify-between">
          <ProgressItem label="Total" value={counts.total} />
          <ProgressItem label="Aguardando" value={counts.waiting} />
          <ProgressItem label="Em atendimento" value={counts.inService} />
          <ProgressItem label="Finalizados" value={counts.finished} />
          <ProgressItem label="Ausentes" value={counts.absent} />
        </View>
      </View>
    </>
  );
}
