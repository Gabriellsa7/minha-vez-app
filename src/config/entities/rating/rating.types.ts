export interface IRatingEligibility {
  canRateProfessional: boolean;
  canRateClinic: boolean;
  professionalId?: string;
  healthUnitId?: string;
}

export interface IRatingSummary {
  average: number | null;
  count: number;
}

export interface IRating {
  _id: string;
  appointmentId: string;
  patientId: string;
  professionalId: string;
  healthUnitId: string;
  professionalStars?: number;
  professionalComment?: string;
  clinicStars?: number;
  clinicComment?: string;
  createdAt: string;
  updatedAt: string;
}
