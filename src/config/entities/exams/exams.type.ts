export interface IExam {
  _id: string;
  patientId: string;
  healthUnitId: string;
  uploadedByUserId: string;
  examType: string;
  examDate?: string | null;
  doctorName?: string;
  notes?: string;
  fileName: string;
  mimeType: string;
  fileSize?: number;
  patientName: string;
  patientCpf: string;
  healthUnitName: string;
  examBookingId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IExamWithFileUrl extends IExam {
  fileUrl: string;
}
