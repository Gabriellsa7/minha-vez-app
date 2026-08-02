import { IHealthProfessional } from "../config/entities/health-professional/health-professional.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_PROFESSIONAL_BY_APPOINTMENT_ID_KEY =
  "GET_PROFESSIONAL_BY_APPOINTMENT_ID_KEY";

export interface IHealthProfessionalByAppointmentIdParams {
  appointmentId: string;
}

const getHealthProfessionalByAppointmentId = async (
  params: IHealthProfessionalByAppointmentIdParams,
): Promise<IHealthProfessional> => {
  const response = await httpClient.get(
    `/health-professionals/appointment/${params.appointmentId}`,
  );

  return response.data;
};

export const useGetHealthProfessionalByAppointmentId = generateReactQuery<
  IHealthProfessional,
  IHealthProfessionalByAppointmentIdParams
>(GET_PROFESSIONAL_BY_APPOINTMENT_ID_KEY, getHealthProfessionalByAppointmentId);
