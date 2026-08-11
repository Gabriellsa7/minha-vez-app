import { IExam } from "../config/entities/exams/exams.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_EXAMS_BY_PATIENT_ID_KEY = "GET_EXAMS_BY_PATIENT_ID_KEY";

export interface IExamsByPatientParams {
  patientId: string;
}

const getExamsByPatientId = async (
  params: IExamsByPatientParams,
): Promise<IExam[]> => {
  const path = `/patients/${params.patientId}/exams`;

  const response = await httpClient.get<IExam[]>(path);
  return response.data;
};

export const useGetExamsByPatientId = generateReactQuery<
  IExam[],
  IExamsByPatientParams
>(GET_EXAMS_BY_PATIENT_ID_KEY, getExamsByPatientId);
