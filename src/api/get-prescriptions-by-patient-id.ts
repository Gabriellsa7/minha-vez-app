import { IPrescription } from "../config/entities/prescriptions/prescriptions.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_PRESCRIPTIONS_BY_PATIENT_ID_KEY =
  "GET_PRESCRIPTIONS_BY_PATIENT_ID_KEY";

export interface IGetPrescriptionsByPatientIdParams {
  patientId: string;
}

const getPrescriptionsByPatientId = async (
  params: IGetPrescriptionsByPatientIdParams,
): Promise<IPrescription[]> => {
  const path = `/patients/${params.patientId}/prescriptions`;

  const response = await httpClient.get<IPrescription[]>(path);
  return response.data;
};

export const useGetPrescriptionsByPatientId = generateReactQuery<
  IPrescription[],
  IGetPrescriptionsByPatientIdParams
>(GET_PRESCRIPTIONS_BY_PATIENT_ID_KEY, getPrescriptionsByPatientId);
