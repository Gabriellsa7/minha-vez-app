const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;




export const CHECK_IN_GRACE_MS = 5 * 60 * 1000;

export type VisitUrgency =
  | { stage: "day"; label: "Hoje" | "Amanhã" }
  | { stage: "hour"; countdownLabel: string }
  | { stage: "checkin"; countdownLabel: string }
  | null;

export function formatCountdown(diffMs: number) {
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






export function getVisitUrgency(targetDate: Date, now: Date): VisitUrgency {
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    if (diffMs > -CHECK_IN_GRACE_MS) {
      return {
        stage: "checkin",
        countdownLabel: formatCountdown(diffMs + CHECK_IN_GRACE_MS),
      };
    }
    return null;
  }

  if (diffMs > ONE_DAY_MS) return null;

  if (diffMs <= ONE_HOUR_MS) {
    return { stage: "hour", countdownLabel: formatCountdown(diffMs) };
  }

  return {
    stage: "day",
    label: isSameCalendarDay(targetDate, now) ? "Hoje" : "Amanhã",
  };
}
