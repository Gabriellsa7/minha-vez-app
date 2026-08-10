import { IHealthProfessional } from "../config/entities/health-professional/health-professional.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_HEALTH_PROFESSIONAL_BY_ID_KEY = "GET_HEALTH_PROFESSIONAL_BY_ID_KEY";

export interface IGetHealthProfessionalByIdParams {
  professionalId: string;
}

const getHealthProfessionalById = async (
  params: IGetHealthProfessionalByIdParams,
): Promise<IHealthProfessional> => {
  const path = `/health-professionals/${params.professionalId}`;
  const response = await httpClient.get(path);

  return response.data;
};

export const useGetHealthProfessionalById = generateReactQuery<
  IHealthProfessional,
  IGetHealthProfessionalByIdParams
>(GET_HEALTH_PROFESSIONAL_BY_ID_KEY, getHealthProfessionalById);
