import { IPatient } from "../config/entities/patients/patients.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export interface IUploadPatientMedicalDocumentPayload {
  patientId: string;
  fileBase64: string;
  fileName: string;
  mimeType: string;
}

export const UPLOAD_PATIENT_MEDICAL_DOCUMENT_KEY =
  "UPLOAD_PATIENT_MEDICAL_DOCUMENT_KEY";

const uploadPatientMedicalDocument = async (
  payload: IUploadPatientMedicalDocumentPayload,
): Promise<IPatient> => {
  const { patientId, ...data } = payload;

  const response = await httpClient.post(
    `/patients/${patientId}/documents`,
    data,
  );
  return response.data;
};

export const useUploadPatientMedicalDocument = generateReactQueryMutation<
  IPatient,
  IUploadPatientMedicalDocumentPayload
>(UPLOAD_PATIENT_MEDICAL_DOCUMENT_KEY, uploadPatientMedicalDocument);
