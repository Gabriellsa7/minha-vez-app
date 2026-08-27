import { EExamBookingStatus } from "@/src/config/entities/exam-bookings/exam-bookings.type";

export const STATUS_LABEL: Record<EExamBookingStatus, string> = {
  [EExamBookingStatus.SCHEDULED]: "Agendado",
  [EExamBookingStatus.CONFIRMED]: "Confirmado",
  [EExamBookingStatus.IN_PROGRESS]: "Em atendimento",
  [EExamBookingStatus.COMPLETED]: "Realizado",
  [EExamBookingStatus.CANCELED]: "Cancelado",
  [EExamBookingStatus.NO_SHOW]: "Não compareceu",
};

export const STATUS_BG: Record<EExamBookingStatus, string> = {
  [EExamBookingStatus.SCHEDULED]: "bg-infoBg",
  [EExamBookingStatus.CONFIRMED]: "bg-infoBg",
  [EExamBookingStatus.IN_PROGRESS]: "bg-warningBg",
  [EExamBookingStatus.COMPLETED]: "bg-statusSuccessBg",
  [EExamBookingStatus.CANCELED]: "bg-statusDangerBg",
  [EExamBookingStatus.NO_SHOW]: "bg-borderPrimary",
};

export const STATUS_TEXT: Record<EExamBookingStatus, string> = {
  [EExamBookingStatus.SCHEDULED]: "text-accentBlue",
  [EExamBookingStatus.CONFIRMED]: "text-textSecondary",
  [EExamBookingStatus.IN_PROGRESS]: "text-warningText",
  [EExamBookingStatus.COMPLETED]: "text-statusSuccessText",
  [EExamBookingStatus.CANCELED]: "text-statusDangerText",
  [EExamBookingStatus.NO_SHOW]: "text-textFourth",
};
