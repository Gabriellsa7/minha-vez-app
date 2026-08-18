import { EBloodType, EPatientPriority } from "./patients.type";

export const PRIORITY_LABEL: Record<EPatientPriority, string> = {
  [EPatientPriority.NORMAL]: "Nenhuma prioridade",
  [EPatientPriority.ELDERLY]: "Idoso (60+)",
  [EPatientPriority.PREGNANT]: "Gestante",
  [EPatientPriority.DISABLED]: "Pessoa com deficiência (PCD)",
  [EPatientPriority.CHRONIC_CONDITION]: "Doença crônica ou condição de saúde",
};

export const PRIORITY_REASON_OPTIONS = [
  EPatientPriority.NORMAL,
  EPatientPriority.PREGNANT,
  EPatientPriority.DISABLED,
  EPatientPriority.CHRONIC_CONDITION,
] as const;

export const PRIORITY_REASONS_REQUIRING_PROOF = new Set<EPatientPriority>([
  EPatientPriority.CHRONIC_CONDITION,
]);

export const ELDERLY_AGE_THRESHOLD = 60;

export const BLOOD_TYPE_LABEL: Record<EBloodType, string> = {
  [EBloodType.A_POSITIVE]: "A+",
  [EBloodType.A_NEGATIVE]: "A-",
  [EBloodType.B_POSITIVE]: "B+",
  [EBloodType.B_NEGATIVE]: "B-",
  [EBloodType.AB_POSITIVE]: "AB+",
  [EBloodType.AB_NEGATIVE]: "AB-",
  [EBloodType.O_POSITIVE]: "O+",
  [EBloodType.O_NEGATIVE]: "O-",
};

export const BLOOD_TYPE_OPTIONS = [
  EBloodType.A_POSITIVE,
  EBloodType.A_NEGATIVE,
  EBloodType.B_POSITIVE,
  EBloodType.B_NEGATIVE,
  EBloodType.AB_POSITIVE,
  EBloodType.AB_NEGATIVE,
  EBloodType.O_POSITIVE,
  EBloodType.O_NEGATIVE,
] as const;

export const ALLOWED_PATIENT_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
