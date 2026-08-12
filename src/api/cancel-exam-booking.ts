import { isAxiosError } from "axios";
import { IExamBooking } from "../config/entities/exam-bookings/exam-bookings.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const CANCEL_EXAM_BOOKING_KEY = "CANCEL_EXAM_BOOKING_KEY";

export interface ICancelExamBookingPayload {
  id: string;
  reason?: string;
}

const cancelExamBooking = async (
  payload: ICancelExamBookingPayload,
): Promise<IExamBooking> => {
  const path = `/exam-bookings/${payload.id}/cancel`;

  try {
    const response = await httpClient.patch(path, { reason: payload.reason });
    return response.data;
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const useCancelExamBooking = generateReactQueryMutation<
  IExamBooking,
  ICancelExamBookingPayload
>(CANCEL_EXAM_BOOKING_KEY, cancelExamBooking);
