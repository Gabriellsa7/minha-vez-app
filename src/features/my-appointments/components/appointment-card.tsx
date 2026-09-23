import {
  EAppointmentStatus,
  IAppointment,
} from "@/src/config/entities/appointments/appointments.types";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { getVisitUrgency } from "@/src/utils/visit-urgency";
import { CalendarClock, MapPin } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { CheckInUrgencyBanner } from "@/src/features/main-content/components/upcoming-visits/visit-urgency";
import { STATUS_BG, STATUS_LABEL, STATUS_TEXT } from "@/src/app/history/util";

interface AppointmentCardProps {
  appointment: IAppointment;
  professional?: IHealthProfessional;
  unit?: IHealthUnit;
  now: Date;
  onPress: () => void;
}

export default function AppointmentCard({
  appointment,
  professional,
  unit,
  now,
  onPress,
}: AppointmentCardProps) {
  const colors = useThemeColors();
  const isCancelled = appointment.status === EAppointmentStatus.CANCELED;
  const urgency = isCancelled
    ? null
    : getVisitUrgency(new Date(appointment.dateTime), now);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4 ${
        isCancelled ? "opacity-70" : ""
      }`}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-textBlack">
            {professional?.specialty || "Consulta"}
          </Text>
          {professional?.name && (
            <Text className="text-sm text-textFifth">{professional.name}</Text>
          )}
        </View>
        {isCancelled && (
          <View
            className={`rounded-full px-3 py-1 ${
              STATUS_BG[appointment.status] ?? "bg-bgPrimary"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                STATUS_TEXT[appointment.status] ?? "text-textFifth"
              }`}
            >
              {STATUS_LABEL[appointment.status] ?? appointment.status}
            </Text>
          </View>
        )}
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <CalendarClock size={14} color={colors.textFourth} />
        <Text className="text-xs text-textFourth">
          {formatDateTime(appointment.dateTime)}
        </Text>
      </View>

      {unit?.name && (
        <View className="mt-1 flex-row items-center gap-2">
          <MapPin size={14} color={colors.textFourth} />
          <Text className="text-xs text-textFourth" numberOfLines={1}>
            {unit.name}
          </Text>
        </View>
      )}
      <CheckInUrgencyBanner urgency={urgency} />
    </Pressable>
  );
}
