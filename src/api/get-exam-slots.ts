import { IExamSlot } from "../config/entities/exam-bookings/exam-bookings.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_EXAM_SLOTS_KEY = "GET_EXAM_SLOTS_KEY";

export interface IExamSlotsParams {
  healthUnitId: string;
  date: string;
}

export interface IExamSlotsResponse {
  date: string;
  slots: IExamSlot[];
}

const getExamSlots = async (
  params: IExamSlotsParams,
): Promise<IExamSlotsResponse> => {
  const path = `/health-units/${params.healthUnitId}/exam-slots`;

  const response = await httpClient.get<IExamSlotsResponse>(path, {
    params: { date: params.date },
  });
  return response.data;
};

export const useGetExamSlots = generateReactQuery<
  IExamSlotsResponse,
  IExamSlotsParams
>(GET_EXAM_SLOTS_KEY, getExamSlots);
