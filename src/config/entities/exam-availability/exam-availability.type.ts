import { WeekDay } from "../health-unit/health-unit.types";

export interface IExamAvailabilityRule {
  _id: string;
  healthUnitId: string;
  weekday: WeekDay;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  capacityPerSlot: number;
  isActive: boolean;
}
