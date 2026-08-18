import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export interface IGetPatientMedicalDocumentDownloadUrlPayload {
  patientId: string;
  documentId: string;
}

export interface IPatientMedicalDocumentDownloadUrl {
  fileUrl: string;
  fileName: string;
}

export const GET_PATIENT_MEDICAL_DOCUMENT_DOWNLOAD_URL_KEY =
  "GET_PATIENT_MEDICAL_DOCUMENT_DOWNLOAD_URL_KEY";

const getPatientMedicalDocumentDownloadUrl = async (
  payload: IGetPatientMedicalDocumentDownloadUrlPayload,
): Promise<IPatientMedicalDocumentDownloadUrl> => {
  const { patientId, documentId } = payload;

  const response = await httpClient.get(
    `/patients/${patientId}/documents/${documentId}/download`,
  );
  return response.data;
};

export const useGetPatientMedicalDocumentDownloadUrl =
  generateReactQueryMutation<
    IPatientMedicalDocumentDownloadUrl,
    IGetPatientMedicalDocumentDownloadUrlPayload
  >(
    GET_PATIENT_MEDICAL_DOCUMENT_DOWNLOAD_URL_KEY,
    getPatientMedicalDocumentDownloadUrl,
  );
