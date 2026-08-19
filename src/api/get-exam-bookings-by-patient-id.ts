import { IExamBooking } from "../config/entities/exam-bookings/exam-bookings.type";
import { generateReactQuery } from "../helpers/react-query";
import { generatePaginatedInfiniteQuery } from "../helpers/react-query/pagination";
import { httpClient } from "../services/api";
import { IPaginatedResponse } from "../types/pagination.types";

export const GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY =
  "GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY";
export const GET_EXAM_BOOKINGS_BY_PATIENT_ID_INFINITE_KEY =
  "GET_EXAM_BOOKINGS_BY_PATIENT_ID_INFINITE_KEY";

export interface IExamBookingsByPatientParams {
  patientId: string;
}

const getExamBookingsByPatientId = async (
  params: IExamBookingsByPatientParams,
): Promise<IExamBooking[]> => {
  const path = `/patients/${params.patientId}/exam-bookings`;

  const response = await httpClient.get<IPaginatedResponse<IExamBooking>>(path);
  return response.data.data;
};

export const useGetExamBookingsByPatientId = generateReactQuery<
  IExamBooking[],
  IExamBookingsByPatientParams
>(GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY, getExamBookingsByPatientId);

export const getExamBookingsByPatientIdPage = async (
  params: IExamBookingsByPatientParams,
  page: number,
): Promise<IPaginatedResponse<IExamBooking>> => {
  const response = await httpClient.get<IPaginatedResponse<IExamBooking>>(
    `/patients/${params.patientId}/exam-bookings`,
    { params: { page, limit: 10 } },
  );
  return response.data;
};

export const useGetExamBookingsByPatientIdInfinite = generatePaginatedInfiniteQuery<
  IExamBooking,
  IExamBookingsByPatientParams
>(GET_EXAM_BOOKINGS_BY_PATIENT_ID_INFINITE_KEY, getExamBookingsByPatientIdPage);
