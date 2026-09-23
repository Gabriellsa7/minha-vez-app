import {
  GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY,
  GET_APPOINTMENTS_BY_PATIENT_ID_KEY,
} from "./get-appointment-by-patient-id";
import { GET_APPOINTMENT_RATING_ELIGIBILITY_KEY } from "./get-appointment-rating-eligibility";
import { GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY } from "./get-appointments-by-professional-id";
import { GET_EXAM_BOOKING_BY_ID_KEY } from "./get-exam-booking-by-id";
import {
  GET_EXAM_BOOKINGS_BY_PATIENT_ID_INFINITE_KEY,
  GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY,
} from "./get-exam-bookings-by-patient-id";
import { GET_EXAM_SLOTS_KEY } from "./get-exam-slots";
import {
  GET_EXAMS_BY_PATIENT_ID_INFINITE_KEY,
  GET_EXAMS_BY_PATIENT_ID_KEY,
} from "./get-exams-by-patient-id";
import { GET_HEALTH_UNIT_RATING_SUMMARY_KEY } from "./get-health-unit-rating-summary";
import { GET_PATIENT_BY_ID_KEY } from "./get-patient-by-id";
import { GET_PROFESSIONAL_RATING_SUMMARY_KEY } from "./get-professional-rating-summary";
import { GET_QUEUE_ITEMS_KEY } from "./get-queue-item-by-patient-id";
import { GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY } from "./get-queue-item-by-queue-id";
import { GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY } from "./get-queues-with-details-by-patient-id";
import { GET_USER_ME_KEY } from "./get-user-me";

export const USER_QUERY_KEYS = [GET_USER_ME_KEY] as const;

export const PATIENT_QUERY_KEYS = [GET_PATIENT_BY_ID_KEY] as const;

export const QUEUE_QUERY_KEYS = [
  GET_QUEUE_ITEMS_KEY,
  GET_QUEUE_ITEMS_BY_QUEUE_ID_KEY,
  GET_QUEUES_WITH_DETAILS_BY_PATIENT_ID_KEY,
] as const;

export const APPOINTMENT_QUERY_KEYS = [
  GET_APPOINTMENTS_BY_PATIENT_ID_KEY,
  GET_APPOINTMENTS_BY_PATIENT_ID_INFINITE_KEY,
  GET_APPOINTMENTS_BY_PROFESSIONAL_ID_KEY,
] as const;

export const EXAM_BOOKING_QUERY_KEYS = [
  GET_EXAM_BOOKINGS_BY_PATIENT_ID_KEY,
  GET_EXAM_BOOKINGS_BY_PATIENT_ID_INFINITE_KEY,
  GET_EXAM_BOOKING_BY_ID_KEY,
  GET_EXAM_SLOTS_KEY,
] as const;

export const EXAM_QUERY_KEYS = [
  GET_EXAMS_BY_PATIENT_ID_KEY,
  GET_EXAMS_BY_PATIENT_ID_INFINITE_KEY,
] as const;

export const RATING_QUERY_KEYS = [
  GET_APPOINTMENT_RATING_ELIGIBILITY_KEY,
  GET_PROFESSIONAL_RATING_SUMMARY_KEY,
  GET_HEALTH_UNIT_RATING_SUMMARY_KEY,
] as const;

export const REALTIME_QUERY_KEYS = [
  ...QUEUE_QUERY_KEYS,
  ...APPOINTMENT_QUERY_KEYS,
  ...EXAM_BOOKING_QUERY_KEYS,
  ...EXAM_QUERY_KEYS,
] as const;
