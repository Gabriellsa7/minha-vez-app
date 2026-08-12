import { IExamOffering } from "../config/entities/exam-offerings/exam-offerings.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_EXAM_OFFERING_BY_ID_KEY = "GET_EXAM_OFFERING_BY_ID_KEY";

export interface IExamOfferingByIdParams {
  id: string;
}

const getExamOfferingById = async (
  params: IExamOfferingByIdParams,
): Promise<IExamOffering> => {
  const path = `/exam-offerings/${params.id}`;

  const response = await httpClient.get<IExamOffering>(path);
  return response.data;
};

export const useGetExamOfferingById = generateReactQuery<
  IExamOffering,
  IExamOfferingByIdParams
>(GET_EXAM_OFFERING_BY_ID_KEY, getExamOfferingById);
