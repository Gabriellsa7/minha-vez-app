import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IQueueItem } from "@/src/config/entities/queue-items/queue-items.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { getVisitUrgency } from "@/src/utils/visit-urgency";
import { CheckCircle2, Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface CheckInStatusCardProps {
  queueItem: IQueueItem;
  appointment?: IAppointment | null;
}

type CheckInTone = "success" | "danger" | "warning";

const TONE_CLASSES: Record<CheckInTone, { container: string; text: string }> = {
  success: {
    container: "border-borderPrimary bg-statusSuccessBg",
    text: "text-statusSuccessText",
  },
  danger: {
    container: "border-statusDangerText bg-statusDangerBg",
    text: "text-statusDangerText",
  },
  warning: {
    container: "border-warningBorder bg-warningBg",
    text: "text-warningText",
  },
};

function useNow(intervalMs: number, enabled: boolean) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, enabled]);

  return now;
}

export function CheckInStatusCard({
  queueItem,
  appointment,
}: CheckInStatusCardProps) {
  const colors = useThemeColors();
  const isCheckedIn = Boolean(queueItem.checkInTime);
  const now = useNow(1000, !isCheckedIn && Boolean(appointment));

  const checkInUrgency =
    appointment && !isCheckedIn
      ? getVisitUrgency(new Date(appointment.dateTime), now)
      : null;
  const isDeadlineNear = checkInUrgency?.stage === "checkin";

  const tone: CheckInTone = isCheckedIn
    ? "success"
    : isDeadlineNear
      ? "danger"
      : "warning";
  const toneClasses = TONE_CLASSES[tone];
  const iconColor = {
    success: colors.statusSuccessText,
    danger: colors.statusDangerText,
    warning: colors.warningText,
  }[tone];

  const message = queueItem.checkInTime
    ? `Confirmado às ${formatDateTime(queueItem.checkInTime).split(" ")[1]}`
    : isDeadlineNear && checkInUrgency
      ? `Faça check-in agora — restam ${checkInUrgency.countdownLabel} antes do cancelamento automático`
      : "Confirme sua presença na recepção da unidade a partir de 20 minutos antes da consulta (tolerância de até 5 minutos de atraso)";

  return (
    <View
      className={`flex-row items-center gap-3 rounded-2xl border p-4 ${toneClasses.container}`}
    >
      {isCheckedIn ? (
        <CheckCircle2 size={18} color={iconColor} />
      ) : (
        <Clock size={18} color={iconColor} />
      )}
      <View className="flex-1">
        <Text className={`text-xs ${toneClasses.text}`}>Check-in</Text>
        <Text className={`text-base font-semibold ${toneClasses.text}`}>
          {message}
        </Text>
      </View>
    </View>
  );
}
