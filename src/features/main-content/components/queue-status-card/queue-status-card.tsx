import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { router } from "expo-router";
import { Clock, ListChecks, LucideIcon } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import QueueDetails from "../queue-details/queue-details";

interface QueueStatusCardProps {
  patientId?: string;
  isLoading: boolean;
  hasActiveQueueItem: boolean;
  scheduledAppointment?: IAppointment;
}

interface StatusPanelProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

function StatusPanel({ icon: Icon, title, children }: StatusPanelProps) {
  const colors = useThemeColors();

  return (
    <View className="w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-5">
      <View className="items-center justify-center rounded-full bg-white/15 p-3">
        <Icon size={22} color={colors.textPrimary} />
      </View>
      <View className="items-center gap-1">
        <Text className="text-base font-semibold text-textPrimary">
          {title}
        </Text>
        {children}
      </View>
    </View>
  );
}

function ScheduledAppointmentPanel({
  appointment,
}: {
  appointment: IAppointment;
}) {
  const { data: healthUnit } = useGetHealthUnitById(
    { healthUnitId: appointment.healthUnitId ?? "" },
    { enabled: Boolean(appointment.healthUnitId) },
  );

  return (
    <StatusPanel icon={Clock} title="Sua consulta está agendada">
      <Text className="text-center text-sm text-textPrimary opacity-70">
        {healthUnit?.name ? `${healthUnit.name} · ` : ""}
        {formatDateTime(appointment.dateTime)}
      </Text>
      <Text className="text-center text-sm text-textPrimary opacity-70">
        A fila será aberta e sua posição calculada quando faltarem 2 horas para
        o horário marcado.
      </Text>
    </StatusPanel>
  );
}

function EmptyQueuePanel() {
  return (
    <StatusPanel icon={ListChecks} title="Nenhuma fila ativa">
      <Text className="text-center text-sm text-textPrimary opacity-70">
        Agende uma consulta para acompanhar sua posição na fila por aqui.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/explore")}
        className="mt-2 min-h-[44px] justify-center rounded-full bg-white px-5 py-2"
      >
        <Text className="text-sm font-semibold text-bgSecondary">
          Buscar atendimento
        </Text>
      </Pressable>
    </StatusPanel>
  );
}

export function QueueStatusCard({
  patientId,
  isLoading,
  hasActiveQueueItem,
  scheduledAppointment,
}: QueueStatusCardProps) {
  if (!patientId) return null;

  if (hasActiveQueueItem) return <QueueDetails patientId={patientId} />;

  if (scheduledAppointment) {
    return <ScheduledAppointmentPanel appointment={scheduledAppointment} />;
  }

  if (isLoading) return null;

  return <EmptyQueuePanel />;
}
