import { IExamAvailabilityRule } from "../config/entities/exam-availability/exam-availability.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_EXAM_AVAILABILITY_RULES_KEY =
  "GET_EXAM_AVAILABILITY_RULES_KEY";

export interface IExamAvailabilityRulesParams {
  healthUnitId: string;
}

const getExamAvailabilityRules = async (
  params: IExamAvailabilityRulesParams,
): Promise<IExamAvailabilityRule[]> => {
  const path = `/health-units/${params.healthUnitId}/exam-availability-rules`;

  const response = await httpClient.get<IExamAvailabilityRule[]>(path);
  return response.data;
};

export const useGetExamAvailabilityRules = generateReactQuery<
  IExamAvailabilityRule[],
  IExamAvailabilityRulesParams
>(GET_EXAM_AVAILABILITY_RULES_KEY, getExamAvailabilityRules);
