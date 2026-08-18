import { EBloodType, IPatient } from "../config/entities/patients/patients.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export interface IUpdatePatientPayload {
  patientId: string;
  phone?: string;
  bloodType?: EBloodType;
  allergies?: string;
  medicalObservations?: string;
}

export const UPDATE_PATIENT_KEY = "UPDATE_PATIENT_KEY";

const updatePatient = async (
  payload: IUpdatePatientPayload,
): Promise<IPatient> => {
  const { patientId, ...data } = payload;

  const response = await httpClient.put(`/patients/${patientId}`, data);
  return response.data;
};

export const useUpdatePatient = generateReactQueryMutation<
  IPatient,
  IUpdatePatientPayload
>(UPDATE_PATIENT_KEY, updatePatient);
