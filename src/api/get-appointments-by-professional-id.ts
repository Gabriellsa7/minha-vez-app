import { IAppointment } from "../config/entities/appointments/appointments.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY =
  "GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY";

export interface IAppointmentsByProfessionalIdParams {
  professionalId: string;
}

const getAppointmentsByProfessionalId = async (
  params: IAppointmentsByProfessionalIdParams,
): Promise<IAppointment[]> => {
  const response = await httpClient.get(
    `/health-professionals/${params.professionalId}/appointments`,
  );

  return response.data;
};

export const useGetAppointmentsByProfessionalId = generateReactQuery<
  IAppointment[],
  IAppointmentsByProfessionalIdParams
>(
  GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY,
  getAppointmentsByProfessionalId,
);
