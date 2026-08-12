import { isAxiosError } from "axios";
import { IExamBooking } from "../config/entities/exam-bookings/exam-bookings.type";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const CREATE_EXAM_BOOKING_KEY = "CREATE_EXAM_BOOKING_KEY";

export interface ICreateExamBookingPayload {
  healthUnitId: string;
  examOfferingId: string;
  scheduledAt: string;
  notes?: string;
}

const createExamBooking = async (
  payload: ICreateExamBookingPayload,
): Promise<IExamBooking> => {
  const path = "/exam-bookings";

  try {
    const response = await httpClient.post(path, payload);
    return response.data;
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const useCreateExamBooking = generateReactQueryMutation<
  IExamBooking,
  ICreateExamBookingPayload
>(CREATE_EXAM_BOOKING_KEY, createExamBooking);
