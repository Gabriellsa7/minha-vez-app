export enum EExamBookingStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  NO_SHOW = "NO_SHOW",
}

export interface IExamBooking {
  _id: string;
  patientId: string;
  healthUnitId: string;
  examOfferingId: string;
  examOfferingName: string;
  healthUnitName: string;
  scheduledAt: string;
  durationMinutes: number;
  priceSnapshot?: number;
  status: EExamBookingStatus;
  resultExamId?: string | null;
  canceledAt?: string | null;
  cancelReason?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function isExamResultAvailable(booking: IExamBooking): boolean {
  return (
    booking.status === EExamBookingStatus.COMPLETED && !!booking.resultExamId
  );
}

export interface IExamSlot {
  time: string;
  remainingCapacity: number;
}
