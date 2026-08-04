import { IHealthUnit } from "../config/entities/health-unit/health-unit.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_HEALTH_UNITS_KEY = "GET_HEALTH_UNITS_KEY";

export const getHealthUnits = async (): Promise<IHealthUnit[]> => {
  const path = "/health-units";

  const response = await httpClient.get<IHealthUnit[]>(path);
  return response.data;
};

export const useGetHealthUnits = generateReactQuery<IHealthUnit[], void>(
  GET_HEALTH_UNITS_KEY,
  getHealthUnits,
);
