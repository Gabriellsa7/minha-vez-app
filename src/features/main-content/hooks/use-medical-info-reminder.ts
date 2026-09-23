import { IPatient } from "@/src/config/entities/patients/patients.type";
import { useEffect, useState } from "react";

const MEDICAL_INFO_REMINDER_DELAY_MS = 3 * 24 * 60 * 60 * 1000;

const shouldRemindMedicalInfo = (patient?: IPatient | null) => {
  if (!patient) return false;

  const hasFilledMedicalInfo =
    Boolean(patient.bloodType) ||
    Boolean(patient.allergies?.trim()) ||
    Boolean(patient.medicalObservations?.trim());

  if (hasFilledMedicalInfo) return false;

  const registeredAt = new Date(patient.createdAt).getTime();
  return Date.now() - registeredAt >= MEDICAL_INFO_REMINDER_DELAY_MS;
};

export function useMedicalInfoReminder(patient?: IPatient | null) {
  const [needsReminder, setNeedsReminder] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setNeedsReminder(shouldRemindMedicalInfo(patient));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [patient]);

  return needsReminder;
}
