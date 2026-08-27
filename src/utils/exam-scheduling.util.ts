/**
 * Exam-scheduling dates/times are stored and matched against availability
 * rules in the backend using UTC getters (no timezone is tracked anywhere in
 * HealthUnit/ExamAvailabilityRule, same as the rest of this codebase). To
 * keep the selected date+time consistent between what the patient picks and
 * what the backend validates, this module builds/reads exam-booking dates
 * with UTC methods instead of the local-time helpers used by the
 * appointment-booking flow.
 */
export function getExamDateTimeFromDateAndTime(
  date: string,
  time: string,
): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

export function formatExamDate(dateIso?: string | Date): string {
  if (!dateIso) return "";
  const date = new Date(dateIso);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  });
}

export function formatExamTime(dateIso?: string | Date): string {
  if (!dateIso) return "";
  const date = new Date(dateIso);

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function formatExamDateTime(dateIso?: string | Date): string {
  if (!dateIso) return "";

  return `${formatExamDate(dateIso)} ${formatExamTime(dateIso)}`;
}

/**
 * Exam dates carry UTC-encoded wall-clock values (see header above), while
 * appointment dates carry real local-time instants. Comparing the two
 * directly with `new Date(...)` can invert their real-world order whenever
 * they land close together, since the exam's UTC label doesn't represent the
 * device's actual timezone offset. This re-anchors an exam date's wall-clock
 * components as local time so it becomes comparable to an appointment date.
 */
export function getExamComparableDate(dateIso: string | Date): Date {
  const date = new Date(dateIso);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}
