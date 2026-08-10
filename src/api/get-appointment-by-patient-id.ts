import { IAppointment } from "../config/entities/appointments/appointments.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_APPOINTMENTS_BY_PATIENT_ID_KEY =
  "GET_APPOINTMENTS_BY_PATIENT_ID_KEY";

export interface IAppointmentParams {
  patientId: string;
}

const getAppointmentsByPatientId = async (
  params: IAppointmentParams,
): Promise<IAppointment[]> => {
  const path = `/patients/${params.patientId}/appointments`;

  const response = await httpClient.get<IAppointment[]>(path);
  return response.data;
};

export const useGetAppointmentsByPatientId = generateReactQuery<
  IAppointment[],
  IAppointmentParams
>(GET_APPOINTMENTS_BY_PATIENT_ID_KEY, getAppointmentsByPatientId);
