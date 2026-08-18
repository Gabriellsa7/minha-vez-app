export interface IPatientMedicalDocument {
  _id: string;
  fileName: string;
  mimeType: string;
  fileSize?: number;
  uploadedAt: Date;
}

export interface IPatient {
  _id: string;
  userId: string;
  cpf: string;
  birthDate: string;
  priority: EPatientPriority;
  phone: string;
  bloodType?: EBloodType;
  allergies?: string;
  medicalObservations?: string;
  medicalDocuments: IPatientMedicalDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export enum EPatientPriority {
  NORMAL = "NORMAL",
  ELDERLY = "ELDERLY",
  PREGNANT = "PREGNANT",
  DISABLED = "DISABLED",
  CHRONIC_CONDITION = "CHRONIC_CONDITION",
}

export enum EBloodType {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
}
