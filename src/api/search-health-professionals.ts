import { IHealthProfessional } from "../config/entities/health-professional/health-professional.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const SEARCH_HEALTH_PROFESSIONALS_KEY = "SEARCH_HEALTH_PROFESSIONALS_KEY";

export interface ISearchHealthProfessionalsParams {
  search: string;
}

export const searchHealthProfessionals = async (
  params: ISearchHealthProfessionalsParams,
): Promise<IHealthProfessional[]> => {
  const response = await httpClient.get<IHealthProfessional[]>(
    "/health-professionals",
    { params: { search: params.search } },
  );
  return response.data;
};

export const useSearchHealthProfessionals = generateReactQuery<
  IHealthProfessional[],
  ISearchHealthProfessionalsParams
>(SEARCH_HEALTH_PROFESSIONALS_KEY, searchHealthProfessionals);
