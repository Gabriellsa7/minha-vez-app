import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IExamBooking } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  formatExamDateTime,
  getExamComparableDate,
} from "@/src/utils/exam-scheduling.util";
import { CalendarClock, MapPin, TestTube } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import AppointmentCard from "./appointment-card";
import { getVisitUrgency, UrgencyBadge } from "./visit-urgency";

interface UpcomingVisitsProps {
  appointments: IAppointment[];
  healthUnits?: IHealthUnit[];
  onPressAppointment: (appointment: IAppointment) => void;
  examBookings: IExamBooking[];
  onPressExam: (examBooking: IExamBooking) => void;
}

const CARD_WIDTH = 260;

export default function UpcomingVisits({
  appointments,
  healthUnits,
  onPressAppointment,
  examBookings,
  onPressExam,
}: UpcomingVisitsProps) {
  const colors = useThemeColors();
  const [now, setNow] = useState(() => new Date());

  // Cards drop off live once their time passes — whether the appointment was
  // ever marked finished or not — instead of waiting for the parent to
  // refetch, so the badge/countdown and the disappearance stay in sync.
  const visibleAppointments = appointments.filter(
    (appointment) =>
      !appointment.finishedAt &&
      new Date(appointment.dateTime).getTime() > now.getTime(),
  );

  const visibleExamBookings = examBookings
    .map((exam) => ({ exam, date: getExamComparableDate(exam.scheduledAt) }))
    .filter(({ date }) => date.getTime() > now.getTime());

  useEffect(() => {
    if (visibleAppointments.length === 0 && visibleExamBookings.length === 0)
      return;

    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [visibleAppointments.length, visibleExamBookings.length]);

  if (visibleAppointments.length === 0 && visibleExamBookings.length === 0) {
    return null;
  }

  return (
    <View className="gap-2">
      <Text className="text-textThird text-base">
        Consultas e exames marcados
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {visibleAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            healthUnits={healthUnits}
            now={now}
            onPress={onPressAppointment}
          />
        ))}
        {visibleExamBookings.map(({ exam, date }) => (
          <Pressable
            key={exam._id}
            accessibilityRole="button"
            accessibilityLabel="Ver informações do exame"
            onPress={() => onPressExam(exam)}
            style={{ width: CARD_WIDTH }}
            className="rounded-2xl border border-borderPrimary bg-bgThird p-3"
          >
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1 flex-row items-center gap-2">
                <View className="rounded-full bg-bgSecondary p-2">
                  <TestTube size={16} color={colors.textPrimary} />
                </View>
                <Text
                  className="flex-1 text-sm font-semibold text-textBlack"
                  numberOfLines={1}
                >
                  {exam.examOfferingName}
                </Text>
              </View>
              <UrgencyBadge urgency={getVisitUrgency(date, now)} />
            </View>
            <View className="mt-3 flex-row items-center gap-2">
              <CalendarClock size={12} color={colors.textFourth} />
              <Text className="text-xs text-textFourth">
                {formatExamDateTime(exam.scheduledAt)}
              </Text>
            </View>
            <View className="mt-1 flex-row items-center gap-2">
              <MapPin size={12} color={colors.textFourth} />
              <Text className="text-xs text-textFourth" numberOfLines={1}>
                {exam.healthUnitName}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
