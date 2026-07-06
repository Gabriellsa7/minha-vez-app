import { IAppointment } from "../config/entities/appointments/appointments.types";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export interface ICreateAppointmentPayload {
  patientId: string;
  professionalId: string;
  healthUnitId: string;
  queueItemId?: string | null;
  dateTime: string;
  notes?: string;
}

export const CREATE_APPOINTMENT_KEY = "CREATE_APPOINTMENT_KEY";

const createAppointment = async (
  payload: ICreateAppointmentPayload,
): Promise<IAppointment> => {
  console.log('[createAppointment] baseURL:', httpClient.defaults.baseURL);
  console.log('[createAppointment] payload:', JSON.stringify(payload));

  const response = await httpClient.post('/appointments', payload);

  return response.data;
};

export const useCreateAppointment = generateReactQueryMutation<
  IAppointment,
  ICreateAppointmentPayload
>(CREATE_APPOINTMENT_KEY, createAppointment);
