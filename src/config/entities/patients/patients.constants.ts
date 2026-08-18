import { EPatientPriority } from "./patients.type";

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
