import { EAppointmentStatus } from "@/src/config/entities/appointments/appointments.types";

export const HISTORY_STATUSES = [
  EAppointmentStatus.COMPLETED,
  EAppointmentStatus.CANCELED,
];

export const STATUS_LABEL: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "Concluída",
  [EAppointmentStatus.CANCELED]: "Cancelada",
};

export const STATUS_BG: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "bg-statusSuccessBg",
  [EAppointmentStatus.CANCELED]: "bg-statusDangerBg",
};

export const STATUS_TEXT: Record<string, string> = {
  [EAppointmentStatus.COMPLETED]: "text-statusSuccessText",
  [EAppointmentStatus.CANCELED]: "text-statusDangerText",
};
