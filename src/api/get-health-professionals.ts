import { IHealthProfessional } from "../config/entities/health-professional/health-professional.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_HEALTH_PROFESSIONALS_KEY = "GET_HEALTH_PROFESSIONALS_KEY";

export const getHealthProfessionals = async (): Promise<
  IHealthProfessional[]
> => {
  const response = await httpClient.get("/health-professionals");

  return response.data;
};

export const useGetHealthProfessionals = generateReactQuery<
  IHealthProfessional[],
  void
>(GET_HEALTH_PROFESSIONALS_KEY, getHealthProfessionals);
