import { IPatient } from "../config/entities/patients/patients.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_PATIENT_BY_ID_KEY = "GET_PATIENT_BY_ID_KEY";

export interface IGetPatientByIdParams {
  userId: string;
}

const getPatientById = async (
  params: IGetPatientByIdParams,
): Promise<IPatient> => {
  const path = `/patients/user/${params.userId}`;

  try {
    const response = await httpClient.get(path);

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const useGetPatientById = generateReactQuery<
  IPatient,
  IGetPatientByIdParams
>(GET_PATIENT_BY_ID_KEY, getPatientById);
