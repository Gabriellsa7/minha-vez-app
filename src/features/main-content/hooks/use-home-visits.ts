import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetExamBookingsByPatientId } from "@/src/api/get-exam-bookings-by-patient-id";
import { useGetQueueItemByPatientId } from "@/src/api/get-queue-item-by-patient-id";
import {
  EAppointmentStatus,
  IAppointment,
} from "@/src/config/entities/appointments/appointments.types";
import {
  EExamBookingStatus,
  IExamBooking,
} from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { EQueueItemStatus } from "@/src/config/entities/queue-items/queue-items.types";
import { getExamComparableDate } from "@/src/utils/exam-scheduling.util";
import { CHECK_IN_GRACE_MS } from "@/src/utils/visit-urgency";
import { useMemo } from "react";

const HOME_REFETCH_INTERVAL_MS = 5000;

export type NextUpcomingVisit =
  | { type: "appointment"; date: Date; appointment: IAppointment }
  | { type: "exam"; date: Date; examBooking: IExamBooking };

const byDate =
  <T,>(getDate: (item: T) => string | Date) =>
  (first: T, second: T) =>
    new Date(getDate(first)).getTime() - new Date(getDate(second)).getTime();

const isUpcomingAppointment = (appointment: IAppointment, now: Date) => {
  if (appointment.status !== EAppointmentStatus.SCHEDULED) return false;

  const scheduledAt = new Date(appointment.dateTime).getTime();
  const cutoffMs = appointment.checkInAt
    ? scheduledAt
    : scheduledAt + CHECK_IN_GRACE_MS;
  return cutoffMs > now.getTime();
};

const isUpcomingExamBooking = (booking: IExamBooking, now: Date) =>
  (booking.status === EExamBookingStatus.SCHEDULED ||
    booking.status === EExamBookingStatus.CONFIRMED) &&
  getExamComparableDate(booking.scheduledAt) > now;

const getUpcomingAppointments = (appointments: IAppointment[] = []) => {
  const now = new Date();
  return appointments
    .filter((appointment) => isUpcomingAppointment(appointment, now))
    .sort(byDate((appointment) => appointment.dateTime));
};

const getUpcomingExamBookings = (examBookings: IExamBooking[] = []) => {
  const now = new Date();
  return examBookings
    .filter((booking) => isUpcomingExamBooking(booking, now))
    .sort(byDate((booking) => booking.scheduledAt));
};

const pickNextVisit = (
  appointment?: IAppointment,
  examBooking?: IExamBooking,
): NextUpcomingVisit | null => {
  const appointmentVisit =
    appointment && !appointment.finishedAt
      ? {
          type: "appointment" as const,
          date: new Date(appointment.dateTime),
          appointment,
        }
      : null;
  const examVisit = examBooking
    ? {
        type: "exam" as const,
        date: getExamComparableDate(examBooking.scheduledAt),
        examBooking,
      }
    : null;

  if (appointmentVisit && examVisit) {
    return appointmentVisit.date <= examVisit.date ? appointmentVisit : examVisit;
  }

  return appointmentVisit ?? examVisit;
};

export function useHomeVisits(patientId?: string) {
  const enabled = Boolean(patientId);

  const { data: appointments, isLoading: isAppointmentsLoading } =
    useGetAppointmentsByPatientId(
      { patientId: patientId ?? "" },
      { enabled, refetchInterval: HOME_REFETCH_INTERVAL_MS },
    );

  const { data: examBookings } = useGetExamBookingsByPatientId(
    { patientId: patientId ?? "" },
    { enabled },
  );

  const { data: queueItems } = useGetQueueItemByPatientId(
    { patientId: patientId ?? "" },
    { enabled, refetchInterval: HOME_REFETCH_INTERVAL_MS },
  );

  const upcomingAppointments = useMemo(
    () => getUpcomingAppointments(appointments),
    [appointments],
  );

  const upcomingExamBookings = useMemo(
    () => getUpcomingExamBookings(examBookings),
    [examBookings],
  );

  const nextAppointment = upcomingAppointments[0];

  const nextUpcomingVisit = useMemo(
    () => pickNextVisit(nextAppointment, upcomingExamBookings[0]),
    [nextAppointment, upcomingExamBookings],
  );

  const hasScheduledAppointment =
    appointments?.some(
      (appointment) => appointment.status === EAppointmentStatus.SCHEDULED,
    ) ?? false;

  const hasRevealedActiveQueueItem =
    queueItems?.some(
      (item) =>
        item.status === EQueueItemStatus.IN_SERVICE ||
        (item.status === EQueueItemStatus.WAITING && item.position != null),
    ) ?? false;

  const getQueueIdForAppointment = (appointment?: IAppointment) =>
    queueItems?.find((item) => item._id === appointment?.queueItemId)?.queueId;

  return {
    isAppointmentsLoading,
    upcomingAppointments,
    upcomingExamBookings,
    nextAppointment,
    nextUpcomingVisit,
    hasScheduledAppointment,
    hasRevealedActiveQueueItem,
    getQueueIdForAppointment,
  };
}
