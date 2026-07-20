import { IHealthUnit } from "../config/entities/health-unit/health-unit.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

const GET_HEALTH_UNIT_BY_ID_KEY = "GET_HEALTH_UNIT_BY_ID_KEY";

interface IGetHealthUnitByIdParams {
  healthUnitId: string;
}

export const getHealthUnitById = async (
  params: IGetHealthUnitByIdParams,
): Promise<IHealthUnit> => {
  const path = `/health-units/${params.healthUnitId}`;
  const response = await httpClient.get(path);

  return response.data;
};

export const useGetHealthUnitById = generateReactQuery<
  IHealthUnit,
  IGetHealthUnitByIdParams
>(GET_HEALTH_UNIT_BY_ID_KEY, getHealthUnitById);
