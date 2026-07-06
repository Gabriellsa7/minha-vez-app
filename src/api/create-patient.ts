import { EPatientPriority, IPatient } from "../config/entities/patients/patients.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export interface ICreatePatientPayload {
  userId: string;
  cpf: string;
  birthDate: string;
  phone: string;
  priority: EPatientPriority;
}

export const CREATE_PATIENT_KEY = "CREATE_PATIENT_KEY";

const createPatient = async (payload: ICreatePatientPayload): Promise<IPatient> => {
  const response = await httpClient.post("/patients", payload);
  return response.data;
};

export const useCreatePatient = generateReactQueryMutation<
  IPatient,
  ICreatePatientPayload
>(CREATE_PATIENT_KEY, createPatient);
