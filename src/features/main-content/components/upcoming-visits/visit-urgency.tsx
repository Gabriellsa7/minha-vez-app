import { View, Text } from "react-native";
import { Clock } from "lucide-react-native";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

export type VisitUrgency =
  | { stage: "day"; label: "Hoje" | "Amanhã" }
  | { stage: "hour"; countdownLabel: string }
  | null;

function formatCountdown(diffMs: number) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isSameCalendarDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

// Hidden by default. Shows "amanhã" once the visit is within 1 day, flips to
// "hoje" as soon as the calendar day rolls over to the visit's own day (even
// if it's still hours away), then escalates to a live red countdown inside
// the last hour.
export function getVisitUrgency(targetDate: Date, now: Date): VisitUrgency {
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0 || diffMs > ONE_DAY_MS) return null;

  if (diffMs <= ONE_HOUR_MS) {
    return { stage: "hour", countdownLabel: formatCountdown(diffMs) };
  }

  return {
    stage: "day",
    label: isSameCalendarDay(targetDate, now) ? "Hoje" : "Amanhã",
  };
}

export function UrgencyBadge({ urgency }: { urgency: VisitUrgency }) {
  if (!urgency) return null;

  const isFinalCountdown = urgency.stage === "hour";

  return (
    <View
      className={`flex-row items-center gap-1.5 self-start rounded-full py-1 pl-1 pr-2.5 ${
        isFinalCountdown ? "bg-statusDangerBg" : "bg-warningBg"
      }`}
    >
      <View
        className={`items-center justify-center rounded-full p-1 ${
          isFinalCountdown ? "bg-statusDangerText" : "bg-warningText"
        }`}
      >
        <Clock size={10} color="#fff" />
      </View>
      <Text
        className={`text-[10px] font-bold uppercase tracking-wide ${
          isFinalCountdown ? "text-statusDangerText" : "text-warningText"
        }`}
      >
        {isFinalCountdown ? urgency.countdownLabel : urgency.label}
      </Text>
    </View>
  );
}
