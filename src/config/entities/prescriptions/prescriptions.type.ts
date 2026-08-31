export interface IPrescriptionExam {
  examOfferingId: string;
  examOfferingName: string;
}

export interface IPrescription {
  _id: string;
  patientId: string;
  professionalId: string;
  professionalName: string;
  healthUnitId: string;
  healthUnitName: string;
  queueItemId?: string | null;
  medications?: string;
  observations?: string;
  exams: IPrescriptionExam[];
  createdAt: string;
  updatedAt: string;
}
