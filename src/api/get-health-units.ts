import { IHealthUnit } from "../config/entities/health-unit/health-unit.types";
import { generateReactQuery } from "../helpers/react-query";
import { generatePaginatedInfiniteQuery } from "../helpers/react-query/pagination";
import { httpClient } from "../services/api";
import { IPaginatedResponse } from "../types/pagination.types";

export const GET_HEALTH_UNITS_KEY = "GET_HEALTH_UNITS_KEY";
export const GET_HEALTH_UNITS_INFINITE_KEY = "GET_HEALTH_UNITS_INFINITE_KEY";

export const getHealthUnits = async (): Promise<IHealthUnit[]> => {
  const path = "/health-units";

  const response = await httpClient.get<IPaginatedResponse<IHealthUnit>>(path);
  return response.data.data;
};

export const useGetHealthUnits = generateReactQuery<IHealthUnit[], void>(
  GET_HEALTH_UNITS_KEY,
  getHealthUnits,
);

export interface IGetHealthUnitsPageParams {
  search?: string;
}

export const getHealthUnitsPage = async (
  params: IGetHealthUnitsPageParams,
  page: number,
): Promise<IPaginatedResponse<IHealthUnit>> => {
  const response = await httpClient.get<IPaginatedResponse<IHealthUnit>>(
    "/health-units",
    { params: { ...params, page, limit: 10 } },
  );
  return response.data;
};

export const useGetHealthUnitsInfinite = generatePaginatedInfiniteQuery<
  IHealthUnit,
  IGetHealthUnitsPageParams
>(GET_HEALTH_UNITS_INFINITE_KEY, getHealthUnitsPage);
