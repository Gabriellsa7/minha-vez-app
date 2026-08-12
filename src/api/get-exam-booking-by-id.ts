import { IExamBooking } from "../config/entities/exam-bookings/exam-bookings.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_EXAM_BOOKING_BY_ID_KEY = "GET_EXAM_BOOKING_BY_ID_KEY";

export interface IExamBookingByIdParams {
  id: string;
}

const getExamBookingById = async (
  params: IExamBookingByIdParams,
): Promise<IExamBooking> => {
  const path = `/exam-bookings/${params.id}`;

  const response = await httpClient.get<IExamBooking>(path);
  return response.data;
};

export const useGetExamBookingById = generateReactQuery<
  IExamBooking,
  IExamBookingByIdParams
>(GET_EXAM_BOOKING_BY_ID_KEY, getExamBookingById);
