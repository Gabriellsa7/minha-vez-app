import { IExamBooking } from "../config/entities/exam-bookings/exam-bookings.type";
import { generateReactQuery } from "../helpers/react-query";
import { httpClient } from "../services/api";

export const GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY =
  "GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY";

export interface IExamBookingsByPatientParams {
  patientId: string;
}

const getExamBookingsByPatientId = async (
  params: IExamBookingsByPatientParams,
): Promise<IExamBooking[]> => {
  const path = `/patients/${params.patientId}/exam-bookings`;

  const response = await httpClient.get<IExamBooking[]>(path);
  return response.data;
};

export const useGetExamBookingsByPatientId = generateReactQuery<
  IExamBooking[],
  IExamBookingsByPatientParams
>(GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY, getExamBookingsByPatientId);
