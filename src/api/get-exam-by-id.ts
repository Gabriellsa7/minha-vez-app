import { IExamWithFileUrl } from "../config/entities/exams/exams.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_EXAM_BY_ID_KEY = "GET_EXAM_BY_ID_KEY";

export interface IExamByIdParams {
  id: string;
}

const getExamById = async (
  params: IExamByIdParams,
): Promise<IExamWithFileUrl> => {
  const path = `/exams/${params.id}`;

  const response = await httpClient.get<IExamWithFileUrl>(path);
  return response.data;
};

export const useGetExamById = generateReactQuery<
  IExamWithFileUrl,
  IExamByIdParams
>(GET_EXAM_BY_ID_KEY, getExamById);
