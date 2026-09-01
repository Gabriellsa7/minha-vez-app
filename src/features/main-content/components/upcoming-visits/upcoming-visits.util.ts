import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IExamBooking } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { getExamComparableDate } from "@/src/utils/exam-scheduling.util";

export const MAX_VISIBLE_VISIT_CARDS = 5;

export type VisitEntry =
  | { type: "appointment"; date: Date; appointment: IAppointment }
  | { type: "exam"; date: Date; exam: IExamBooking };

// Cards drop off live once their time passes — whether the appointment was
// ever marked finished or not — instead of waiting for the parent to
// refetch, so the badge/countdown and the disappearance stay in sync.
export function getVisibleVisits(
  appointments: IAppointment[],
  examBookings: IExamBooking[],
  now: Date,
): VisitEntry[] {
  const visibleAppointments: VisitEntry[] = appointments
    .filter(
      (appointment) =>
        !appointment.finishedAt &&
        new Date(appointment.dateTime).getTime() > now.getTime(),
    )
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
