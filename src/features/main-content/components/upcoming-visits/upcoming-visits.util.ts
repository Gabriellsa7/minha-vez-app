import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IExamBooking } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { getExamComparableDate } from "@/src/utils/exam-scheduling.util";
import { CHECK_IN_GRACE_MS } from "@/src/utils/visit-urgency";

export const MAX_VISIBLE_VISIT_CARDS = 5;

export type VisitEntry =
  | { type: "appointment"; date: Date; appointment: IAppointment }
  | { type: "exam"; date: Date; exam: IExamBooking };

export function getVisibleVisits(
  appointments: IAppointment[],
  examBookings: IExamBooking[],
  now: Date,
): VisitEntry[] {
  const visibleAppointments: VisitEntry[] = appointments
    .filter((appointment) => {
      if (appointment.finishedAt) return false;
      const cutoff = appointment.checkInAt
        ? new Date(appointment.dateTime).getTime()
        : new Date(appointment.dateTime).getTime() + CHECK_IN_GRACE_MS;
      return cutoff > now.getTime();
    })
    .map((appointment) => ({
      type: "appointment" as const,
      date: new Date(appointment.dateTime),
      appointment,
    }));

  const visibleExamBookings: VisitEntry[] = examBookings
    .map((exam) => ({
      type: "exam" as const,
      date: getExamComparableDate(exam.scheduledAt),
      exam,
    }))
    .filter(({ date }) => date.getTime() > now.getTime());

  return [...visibleAppointments, ...visibleExamBookings].sort(
    (first, second) => first.date.getTime() - second.date.getTime(),
  );
}
