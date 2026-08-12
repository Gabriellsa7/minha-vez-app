import { IRatingSummary } from "../config/entities/rating/rating.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_PROFESSIONAL_RATING_SUMMARY_KEY =
  "GET_PROFESSIONAL_RATING_SUMMARY_KEY";

export interface IGetProfessionalRatingSummaryParams {
  professionalId: string;
}

const getProfessionalRatingSummary = async (
  params: IGetProfessionalRatingSummaryParams,
): Promise<IRatingSummary> => {
  const path = `/health-professionals/${params.professionalId}/rating-summary`;
  const response = await httpClient.get(path);

  return response.data;
};

export const useGetProfessionalRatingSummary = generateReactQuery<
  IRatingSummary,
  IGetProfessionalRatingSummaryParams
>(GET_PROFESSIONAL_RATING_SUMMARY_KEY, getProfessionalRatingSummary);
