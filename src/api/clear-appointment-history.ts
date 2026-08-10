import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export interface IClearAppointmentHistoryPayload {
  patientId: string;
}

export interface IClearAppointmentHistoryResponse {
  message: string;
  count: number;
}

export const CLEAR_APPOINTMENT_HISTORY_KEY = "CLEAR_APPOINTMENT_HISTORY_KEY";

const clearAppointmentHistory = async (
  payload: IClearAppointmentHistoryPayload,
): Promise<IClearAppointmentHistoryResponse> => {
  const response = await httpClient.delete(
    `/patients/${payload.patientId}/appointments`,
  );
  return response.data;
};

export const useClearAppointmentHistory = generateReactQueryMutation<
  IClearAppointmentHistoryResponse,
  IClearAppointmentHistoryPayload
>(CLEAR_APPOINTMENT_HISTORY_KEY, clearAppointmentHistory);
