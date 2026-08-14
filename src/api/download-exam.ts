import { isAxiosError } from "axios";
import { IExamWithFileUrl } from "../config/entities/exams/exams.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const DOWNLOAD_EXAM_KEY = "DOWNLOAD_EXAM_KEY";

export interface IDownloadExamPayload {
  id: string;
}

const downloadExam = async (
  payload: IDownloadExamPayload,
): Promise<IExamWithFileUrl> => {
  const path = `/exams/${payload.id}/download`;

  try {
    const response = await httpClient.patch<IExamWithFileUrl>(path);
    return response.data;
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const useDownloadExam = generateReactQueryMutation<
  IExamWithFileUrl,
  IDownloadExamPayload
>(DOWNLOAD_EXAM_KEY, downloadExam);
