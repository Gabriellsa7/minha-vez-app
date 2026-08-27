import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IExamBooking } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  formatExamDateTime,
  getExamComparableDate,
} from "@/src/utils/exam-scheduling.util";
import { formatDateTime } from "@/src/utils/format-date-time";
import {
  CalendarClock,
  Clock,
  MapPin,
  Stethoscope,
  TestTube,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface UpcomingVisitsProps {
  appointment?: IAppointment | null;
  professional?: IHealthProfessional;
  appointmentUnit?: IHealthUnit;
  onPressAppointment: () => void;
  examBookings: IExamBooking[];
  onPressExam: (examBooking: IExamBooking) => void;
}

const CARD_WIDTH = 260;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

type VisitUrgency =
  | { stage: "day"; label: "Hoje" | "Amanhã" }
  | { stage: "hour"; countdownLabel: string }
  | null;

function formatCountdown(diffMs: number) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isSameCalendarDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

// Hidden by default. Shows "amanhã" once the visit is within 1 day, flips to
// "hoje" as soon as the calendar day rolls over to the visit's own day (even
// if it's still hours away), then escalates to a live red countdown inside
// the last hour.
function getVisitUrgency(targetDate: Date, now: Date): VisitUrgency {
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0 || diffMs > ONE_DAY_MS) return null;

  if (diffMs <= ONE_HOUR_MS) {
    return { stage: "hour", countdownLabel: formatCountdown(diffMs) };
  }

  return {
    stage: "day",
    label: isSameCalendarDay(targetDate, now) ? "Hoje" : "Amanhã",
  };
}

function UrgencyBadge({ urgency }: { urgency: VisitUrgency }) {
  if (!urgency) return null;

  const isFinalCountdown = urgency.stage === "hour";

  return (
    <View
      className={`flex-row items-center gap-1.5 self-start rounded-full py-1 pl-1 pr-2.5 ${
        isFinalCountdown ? "bg-statusDangerBg" : "bg-warningBg"
      }`}
    >
      <View
        className={`items-center justify-center rounded-full p-1 ${
          isFinalCountdown ? "bg-statusDangerText" : "bg-warningText"
        }`}
      >
        <Clock size={10} color="#fff" />
      </View>
      <Text
        className={`text-[10px] font-bold uppercase tracking-wide ${
          isFinalCountdown ? "text-statusDangerText" : "text-warningText"
        }`}
      >
        {isFinalCountdown ? urgency.countdownLabel : urgency.label}
      </Text>
    </View>
  );
}

export default function UpcomingVisits({
  appointment,
  professional,
  appointmentUnit,
  onPressAppointment,
  examBookings,
  onPressExam,
}: UpcomingVisitsProps) {
  const colors = useThemeColors();
  const [now, setNow] = useState(() => new Date());

  const hasPendingAppointment = !!appointment && !appointment.finishedAt;

  useEffect(() => {
    if (!hasPendingAppointment && examBookings.length === 0) return;

    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [hasPendingAppointment, examBookings.length]);

  // Cards drop off live once their time passes — whether the appointment was
  // ever marked finished or not — instead of waiting for the parent to
  // refetch, so the badge/countdown and the disappearance stay in sync.
  const appointmentDate = appointment ? new Date(appointment.dateTime) : null;
  const hasAppointment =
    hasPendingAppointment &&
    !!appointmentDate &&
    appointmentDate.getTime() > now.getTime();
  const appointmentUrgency = appointmentDate
    ? getVisitUrgency(appointmentDate, now)
    : null;

  const visibleExamBookings = examBookings
    .map((exam) => ({ exam, date: getExamComparableDate(exam.scheduledAt) }))
    .filter(({ date }) => date.getTime() > now.getTime());

  if (!hasAppointment && visibleExamBookings.length === 0) {
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
        {hasAppointment && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver informações da consulta"
            onPress={onPressAppointment}
            style={{ width: CARD_WIDTH }}
            className="rounded-2xl border border-borderPrimary bg-bgThird p-3"
          >
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1 flex-row items-center gap-2">
                <View className="rounded-full bg-bgSecondary p-2">
                  <Stethoscope size={16} color={colors.textPrimary} />
                </View>
                <Text
                  className="flex-1 text-sm font-semibold text-textBlack"
                  numberOfLines={1}
                >
                  {professional?.specialty || "Consulta"}
                </Text>
              </View>
              <UrgencyBadge urgency={appointmentUrgency} />
            </View>
            {professional?.name && (
              <View className="mt-1 flex-row items-center gap-2">
                <User size={12} color={colors.textFourth} />
                <Text className="text-xs text-textFourth" numberOfLines={1}>
                  {professional.name}
                </Text>
              </View>
            )}
            <View className="mt-3 flex-row items-center gap-2">
              <CalendarClock size={12} color={colors.textFourth} />
              <Text className="text-xs text-textFourth">
                {formatDateTime(appointment!.dateTime)}
              </Text>
            </View>
            {appointmentUnit?.name && (
              <View className="mt-1 flex-row items-center gap-2">
                <MapPin size={12} color={colors.textFourth} />
                <Text className="text-xs text-textFourth" numberOfLines={1}>
                  {appointmentUnit.name}
                </Text>
              </View>
            )}
          </Pressable>
        )}
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
