import { IHealthProfessional } from "../config/entities/health-professional/health-professional.types";
import { generateReactQuery } from "../helpers/react-query";
import { generatePaginatedInfiniteQuery } from "../helpers/react-query/pagination";
import { httpClient } from "../services/api";
import { IPaginatedResponse } from "../types/pagination.types";

export const GET_HEALTH_PROFESSIONALS_KEY = "GET_HEALTH_PROFESSIONALS_KEY";
export const GET_HEALTH_PROFESSIONALS_INFINITE_KEY =
  "GET_HEALTH_PROFESSIONALS_INFINITE_KEY";

export const getHealthProfessionals = async (): Promise<
  IHealthProfessional[]
> => {
  const response =
    await httpClient.get<IPaginatedResponse<IHealthProfessional>>(
      "/health-professionals",
    );

  return response.data.data;
};

export const useGetHealthProfessionals = generateReactQuery<
  IHealthProfessional[],
  void
>(GET_HEALTH_PROFESSIONALS_KEY, getHealthProfessionals);

export interface IGetHealthProfessionalsPageParams {
  search?: string;
  specialty?: string;
}

export const getHealthProfessionalsPage = async (
  params: IGetHealthProfessionalsPageParams,
  page: number,
): Promise<IPaginatedResponse<IHealthProfessional>> => {
  const response = await httpClient.get<
    IPaginatedResponse<IHealthProfessional>
  >("/health-professionals", { params: { ...params, page, limit: 10 } });
  return response.data;
};

export const useGetHealthProfessionalsInfinite = generatePaginatedInfiniteQuery<
  IHealthProfessional,
  IGetHealthProfessionalsPageParams
>(GET_HEALTH_PROFESSIONALS_INFINITE_KEY, getHealthProfessionalsPage);
