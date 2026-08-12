import { IExamOffering } from "../config/entities/exam-offerings/exam-offerings.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_EXAM_OFFERINGS_BY_HEALTH_UNIT_ID_KEY =
  "GET_EXAM_OFFERINGS_BY_HEALTH_UNIT_ID_KEY";

export interface IExamOfferingsByHealthUnitParams {
  healthUnitId: string;
}

const getExamOfferingsByHealthUnitId = async (
  params: IExamOfferingsByHealthUnitParams,
): Promise<IExamOffering[]> => {
  const path = `/health-units/${params.healthUnitId}/exam-offerings`;

  const response = await httpClient.get<IExamOffering[]>(path);
  return response.data;
};

export const useGetExamOfferingsByHealthUnitId = generateReactQuery<
  IExamOffering[],
  IExamOfferingsByHealthUnitParams
>(GET_EXAM_OFFERINGS_BY_HEALTH_UNIT_ID_KEY, getExamOfferingsByHealthUnitId);
