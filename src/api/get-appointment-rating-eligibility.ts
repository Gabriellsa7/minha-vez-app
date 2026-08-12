import { IRatingEligibility } from "../config/entities/rating/rating.types";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_APPOINTMENT_RATING_ELIGIBILITY_KEY =
  "GET_APPOINTMENT_RATING_ELIGIBILITY_KEY";

export interface IGetAppointmentRatingEligibilityParams {
  appointmentId: string;
}

const getAppointmentRatingEligibility = async (
  params: IGetAppointmentRatingEligibilityParams,
): Promise<IRatingEligibility> => {
  const path = `/appointments/${params.appointmentId}/rating-eligibility`;
  const response = await httpClient.get(path);

  return response.data;
};

export const useGetAppointmentRatingEligibility = generateReactQuery<
  IRatingEligibility,
  IGetAppointmentRatingEligibilityParams
>(GET_APPOINTMENT_RATING_ELIGIBILITY_KEY, getAppointmentRatingEligibility);
