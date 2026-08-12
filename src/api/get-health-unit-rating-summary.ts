import { IRatingSummary } from "../config/entities/rating/rating.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_HEALTH_UNIT_RATING_SUMMARY_KEY =
  "GET_HEALTH_UNIT_RATING_SUMMARY_KEY";

export interface IGetHealthUnitRatingSummaryParams {
  healthUnitId: string;
}

const getHealthUnitRatingSummary = async (
  params: IGetHealthUnitRatingSummaryParams,
): Promise<IRatingSummary> => {
  const path = `/health-units/${params.healthUnitId}/rating-summary`;
  const response = await httpClient.get(path);

  return response.data;
};

export const useGetHealthUnitRatingSummary = generateReactQuery<
  IRatingSummary,
  IGetHealthUnitRatingSummaryParams
>(GET_HEALTH_UNIT_RATING_SUMMARY_KEY, getHealthUnitRatingSummary);
