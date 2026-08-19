import { IExam } from "../config/entities/exams/exams.type";
import { generateReactQuery } from "../helpers/react-query";
import { generatePaginatedInfiniteQuery } from "../helpers/react-query/pagination";
import { httpClient } from "../services/api";
import { IPaginatedResponse } from "../types/pagination.types";

export const GET_EXAMS_BY_PATIENT_ID_KEY = "GET_EXAMS_BY_PATIENT_ID_KEY";
export const GET_EXAMS_BY_PATIENT_ID_INFINITE_KEY =
  "GET_EXAMS_BY_PATIENT_ID_INFINITE_KEY";

export interface IExamsByPatientParams {
  patientId: string;
}

const getExamsByPatientId = async (
  params: IExamsByPatientParams,
): Promise<IExam[]> => {
  const path = `/patients/${params.patientId}/exams`;

  const response = await httpClient.get<IPaginatedResponse<IExam>>(path);
  return response.data.data;
};

export const useGetExamsByPatientId = generateReactQuery<
  IExam[],
  IExamsByPatientParams
>(GET_EXAMS_BY_PATIENT_ID_KEY, getExamsByPatientId);

export const getExamsByPatientIdPage = async (
  params: IExamsByPatientParams,
  page: number,
): Promise<IPaginatedResponse<IExam>> => {
  const response = await httpClient.get<IPaginatedResponse<IExam>>(
    `/patients/${params.patientId}/exams`,
    { params: { page, limit: 10 } },
  );
  return response.data;
};

export const useGetExamsByPatientIdInfinite = generatePaginatedInfiniteQuery<
  IExam,
  IExamsByPatientParams
>(GET_EXAMS_BY_PATIENT_ID_INFINITE_KEY, getExamsByPatientIdPage);
