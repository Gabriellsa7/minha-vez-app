import { isAxiosError } from "axios";
import { IExamBooking } from "../config/entities/exam-bookings/exam-bookings.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const RESCHEDULE_EXAM_BOOKING_KEY = "RESCHEDULE_EXAM_BOOKING_KEY";

export interface IRescheduleExamBookingPayload {
  id: string;
  scheduledAt: string;
}

const rescheduleExamBooking = async (
  payload: IRescheduleExamBookingPayload,
): Promise<IExamBooking> => {
  const path = `/exam-bookings/${payload.id}/reschedule`;

  try {
    const response = await httpClient.patch(path, {
      scheduledAt: payload.scheduledAt,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const useRescheduleExamBooking = generateReactQueryMutation<
  IExamBooking,
  IRescheduleExamBookingPayload
>(RESCHEDULE_EXAM_BOOKING_KEY, rescheduleExamBooking);
