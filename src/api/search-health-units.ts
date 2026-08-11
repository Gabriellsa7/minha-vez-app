import { IHealthUnit } from "../config/entities/health-unit/health-unit.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const SEARCH_HEALTH_UNITS_KEY = "SEARCH_HEALTH_UNITS_KEY";

export interface ISearchHealthUnitsParams {
  search: string;
}

export const searchHealthUnits = async (
  params: ISearchHealthUnitsParams,
): Promise<IHealthUnit[]> => {
  const response = await httpClient.get<IHealthUnit[]>("/health-units", {
    params: { search: params.search },
  });
  return response.data;
};

export const useSearchHealthUnits = generateReactQuery<
  IHealthUnit[],
  ISearchHealthUnitsParams
>(SEARCH_HEALTH_UNITS_KEY, searchHealthUnits);
