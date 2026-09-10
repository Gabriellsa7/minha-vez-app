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
