import { isAxiosError } from "axios";
import { IRating } from "../config/entities/rating/rating.types";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const CREATE_APPOINTMENT_RATING_KEY = "CREATE_APPOINTMENT_RATING_KEY";

export interface ICreateAppointmentRatingPayload {
  appointmentId: string;
  professionalStars?: number;
  professionalComment?: string;
  clinicStars?: number;
  clinicComment?: string;
}

const createAppointmentRating = async (
  payload: ICreateAppointmentRatingPayload,
): Promise<IRating> => {
  const { appointmentId, ...body } = payload;
  const path = `/appointments/${appointmentId}/ratings`;

  try {
    const response = await httpClient.post(path, body);
    return response.data;
  } catch (error) {
    if (isAxiosError<{ error?: string }>(error) && error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw error;
  }
};

export const useCreateAppointmentRating = generateReactQueryMutation<
  IRating,
  ICreateAppointmentRatingPayload
>(CREATE_APPOINTMENT_RATING_KEY, createAppointmentRating);
