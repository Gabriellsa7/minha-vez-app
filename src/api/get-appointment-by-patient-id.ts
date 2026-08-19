import { EAppointmentStatus, IAppointment } from "../config/entities/appointments/appointments.types";
import { generateReactQuery } from "../helpers/react-query";
import { generatePaginatedInfiniteQuery } from "../helpers/react-query/pagination";
import { httpClient } from "../services/api";
import { IPaginatedResponse } from "../types/pagination.types";

export const GET_APPOINTMENTS_BY_PATIENT_ID_KEY =
  "GET_APPOINTMENTS_BY_PATIENT_ID_KEY";
export const GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY =
  "GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY";

export interface IAppointmentParams {
  patientId: string;
}

const getAppointmentsByPatientId = async (
  params: IAppointmentParams,
): Promise<IAppointment[]> => {
  const path = `/patients/${params.patientId}/appointments`;

  const response = await httpClient.get<IPaginatedResponse<IAppointment>>(path);
  return response.data.data;
};

export const useGetAppointmentsByPatientId = generateReactQuery<
  IAppointment[],
  IAppointmentParams
>(GET_APPOINTMENTS_BY_PATIENT_ID_KEY, getAppointmentsByPatientId);

export interface IGetAppointmentsByPatientIdPageParams {
  patientId: string;
  status?: EAppointmentStatus[];
}

export const getAppointmentsByPatientIdPage = async (
  params: IGetAppointmentsByPatientIdPageParams,
  page: number,
): Promise<IPaginatedResponse<IAppointment>> => {
  const response = await httpClient.get<IPaginatedResponse<IAppointment>>(
    `/patients/${params.patientId}/appointments`,
    {
      params: {
        status: params.status?.join(","),
        page,
        limit: 10,
      },
    },
  );
  return response.data;
};

export const useGetAppointmentsByPatientIdInfinite = generatePaginatedInfiniteQuery<
  IAppointment,
  IGetAppointmentsByPatientIdPageParams
>(GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY, getAppointmentsByPatientIdPage);
