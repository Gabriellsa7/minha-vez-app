import { IPatient } from "../config/entities/patients/patients.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export interface IDeletePatientMedicalDocumentPayload {
  patientId: string;
  documentId: string;
}

export const DELETE_PATIENT_MEDICAL_DOCUMENT_KEY =
  "DELETE_PATIENT_MEDICAL_DOCUMENT_KEY";

const deletePatientMedicalDocument = async (
  payload: IDeletePatientMedicalDocumentPayload,
): Promise<IPatient> => {
  const { patientId, documentId } = payload;

  const response = await httpClient.delete(
    `/patients/${patientId}/documents/${documentId}`,
  );
  return response.data;
};

export const useDeletePatientMedicalDocument = generateReactQueryMutation<
  IPatient,
  IDeletePatientMedicalDocumentPayload
>(DELETE_PATIENT_MEDICAL_DOCUMENT_KEY, deletePatientMedicalDocument);
