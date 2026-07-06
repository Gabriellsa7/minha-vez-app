import { IPatient } from "../config/entities/patients/patients.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_PATIENT_BY_ID_KEY = "GET_PATIENT_BY_ID_KEY";

export interface IGetPatientByIdParams {
  userId: string;
}

const getPatientById = async (
  params: IGetPatientByIdParams,
): Promise<IPatient | null> => {
  const path = `/patients/user/${params.userId}`;

  try {
    const response = await httpClient.get(path, {
      validateStatus: (status) => status === 404 || (status >= 200 && status < 300),
    });

    if (response.status === 404) {
      return null;
    }

    return response.data ?? null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
};

export const useGetPatientById = generateReactQuery<
  IPatient | null,
  IGetPatientByIdParams
>(GET_PATIENT_BY_ID_KEY, getPatientById);
