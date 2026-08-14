import { isAxiosError } from "axios";
import { IAppointment } from "../config/entities/appointments/appointments.types";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const CANCEL_APPOINTMENT_KEY = "CANCEL_APPOINTMENT_KEY";

export interface ICancelAppointmentPayload {
  id: string;
}

const cancelAppointment = async (
  payload: ICancelAppointmentPayload,
): Promise<IAppointment> => {
  const path = `/appointments/${payload.id}/cancel`;

  try {
    const response = await httpClient.patch(path);
    return response.data;
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw error;
  }
};

export const useCancelAppointment = generateReactQueryMutation<
  IAppointment,
  ICancelAppointmentPayload
>(CANCEL_APPOINTMENT_KEY, cancelAppointment);
