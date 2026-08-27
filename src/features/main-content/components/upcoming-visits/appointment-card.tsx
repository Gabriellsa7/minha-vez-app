import { useGetHealthProfessionalByAppointmentId } from "@/src/api/get-health-professional-by-appointment-id";
import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import {
  CalendarClock,
  MapPin,
  Stethoscope,
  User,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { getVisitUrgency, UrgencyBadge } from "./visit-urgency";

const CARD_WIDTH = 260;

interface AppointmentCardProps {
  appointment: IAppointment;
  healthUnits?: IHealthUnit[];
  now: Date;
  onPress: (appointment: IAppointment) => void;
}

export default function AppointmentCard({
  appointment,
  healthUnits,
  now,
  onPress,
}: AppointmentCardProps) {
  const colors = useThemeColors();

  const { data: professional } = useGetHealthProfessionalByAppointmentId({
    appointmentId: appointment._id,
  });

  const appointmentUnit = healthUnits?.find(
    (unit) => unit._id === professional?.healthUnitId,
  );

  const appointmentDate = new Date(appointment.dateTime);
  const urgency = getVisitUrgency(appointmentDate, now);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ver informações da consulta"
      onPress={() => onPress(appointment)}
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
        <UrgencyBadge urgency={urgency} />
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
          {formatDateTime(appointment.dateTime)}
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
  );
}
