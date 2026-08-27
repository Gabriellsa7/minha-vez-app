import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IExamBooking } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatExamDateTime } from "@/src/utils/exam-scheduling.util";
import { formatDateTime } from "@/src/utils/format-date-time";
import {
  CalendarClock,
  MapPin,
  Stethoscope,
  TestTube,
  User,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

interface UpcomingVisitsProps {
  appointment?: IAppointment | null;
  professional?: IHealthProfessional;
  appointmentUnit?: IHealthUnit;
  onPressAppointment: () => void;
  examBookings: IExamBooking[];
  onPressExam: (examBooking: IExamBooking) => void;
}

const CARD_WIDTH = 220;

export default function UpcomingVisits({
  appointment,
  professional,
  appointmentUnit,
  onPressAppointment,
  examBookings,
  onPressExam,
}: UpcomingVisitsProps) {
  const colors = useThemeColors();

  const hasAppointment = !!appointment && !appointment.finishedAt;

  if (!hasAppointment && examBookings.length === 0) {
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
            <View className="flex-row items-center gap-2">
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
        {examBookings.map((exam) => (
          <Pressable
            key={exam._id}
            accessibilityRole="button"
            accessibilityLabel="Ver informações do exame"
            onPress={() => onPressExam(exam)}
            style={{ width: CARD_WIDTH }}
            className="rounded-2xl border border-borderPrimary bg-bgThird p-3"
          >
            <View className="flex-row items-center gap-2">
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
