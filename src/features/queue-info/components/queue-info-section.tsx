import { useGetHealthProfessionalById } from "@/src/api/get-health-professional-by-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import {
  EQueueItemStatus,
  IQueueItem,
} from "@/src/config/entities/queue-items/queue-items.types";
import { IQueueWithDetails } from "@/src/config/entities/queue/queue.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { AlertTriangle, Hash } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { POSITION_WINDOW_MS } from "../queue-info.util";
import { CheckInStatusCard } from "./check-in-status-card";
import { QueueHero } from "./queue-hero";
import {
  HealthUnitAddressCard,
  ProfessionalCard,
} from "./queue-location-cards";
import { QueueCounts, QueueStats } from "./queue-stats";

interface QueueInfoSectionProps {
  queueItems?: IQueueItem[];
  queue: IQueueWithDetails;
  patientQueueItem?: IQueueItem | null;
  appointment?: IAppointment | null;
  handleRefresh: () => void;
}

const countByStatus = (items: IQueueItem[] = []): QueueCounts => {
  const count = (status: EQueueItemStatus) =>
    items.filter((item) => item.status === status).length;

  return {
    total: items.length,
    waiting: count(EQueueItemStatus.WAITING),
    inService: Math.min(count(EQueueItemStatus.IN_SERVICE), 1),
    finished: count(EQueueItemStatus.FINISHED),
    absent: count(EQueueItemStatus.ABSENT),
  };
};

const QUEUE_ORDER_NOTICE =
  "Sua posição na fila pode mudar a qualquer momento. Pacientes com prioridade (idosos, gestantes, pessoas com deficiência ou condição de saúde), encaixes e ausências de outros pacientes podem alterar a ordem de atendimento.";

export default function QueueInfoSection({
  queueItems,
  queue,
  patientQueueItem,
  appointment,
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

  const counts = countByStatus(queueItems);
  const inServiceItem = queueItems?.find(
    (item) => item.status === EQueueItemStatus.IN_SERVICE,
  );

  const isMyTurn = patientQueueItem?.status === EQueueItemStatus.IN_SERVICE;
  const isWaitingWithoutPosition =
    patientQueueItem?.status === EQueueItemStatus.WAITING &&
    patientQueueItem.position == null;
  const positionRevealTime = appointment
    ? formatDateTime(
        new Date(new Date(appointment.dateTime).getTime() - POSITION_WINDOW_MS),
      ).split(" ")[1]
    : null;

  const appointmentDuration = professional?.schedule?.appointmentDuration ?? 0;
  const estimatedWaitMinutes =
    queue?.estimatedWaitMinutes != null
      ? Math.max(queue.estimatedWaitMinutes, appointmentDuration)
      : null;
  const estimatedWaitLabel = isMyTurn
    ? "Agora"
    : estimatedWaitMinutes !== null
      ? `${estimatedWaitMinutes} min`
      : "N/A";

  const noticeMessage = isWaitingWithoutPosition
    ? `Sua posição na fila só será calculada quando faltarem 2 horas para sua consulta${
        positionRevealTime ? `, a partir das ${positionRevealTime}` : ""
      }. Volte a esta tela perto do horário para acompanhar sua vez.`
    : QUEUE_ORDER_NOTICE;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <QueueHero
        queue={queue}
        patientQueueItem={patientQueueItem}
        inServiceItem={inServiceItem}
        onRefresh={handleRefresh}
      />

      <View className="gap-4 p-5">
        <View className="flex-row gap-3 rounded-2xl border border-warningBorder bg-warningBg p-4">
          <AlertTriangle size={18} color={colors.warningText} />
          <Text className="flex-1 text-xs font-medium text-warningText">
            {noticeMessage}
          </Text>
        </View>

        {isMyTurn && (
          <View className="rounded-2xl border border-borderPrimary bg-statusSuccessBg p-4">
            <Text className="font-bold text-statusSuccessText">
              É a sua vez! Dirija-se ao consultório
              {professional?.room ? ` ${professional.room}` : ""}.
            </Text>
          </View>
        )}

        <QueueStats counts={counts} estimatedWaitLabel={estimatedWaitLabel} />

        {patientQueueItem && (
          <CheckInStatusCard
            queueItem={patientQueueItem}
            appointment={appointment}
          />
        )}

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

        {professional && <ProfessionalCard professional={professional} />}
        {healthUnit && <HealthUnitAddressCard healthUnit={healthUnit} />}
      </View>
    </ScrollView>
  );
}
