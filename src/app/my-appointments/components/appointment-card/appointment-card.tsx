import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { CalendarClock, MapPin } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface AppointmentCardProps {
  appointment: IAppointment;
  professional?: IHealthProfessional;
  unit?: IHealthUnit;
  onPress: () => void;
}

export default function AppointmentCard({
  appointment,
  professional,
  unit,
  onPress,
}: AppointmentCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
    >
      <Text className="text-base font-semibold text-textBlack">
        {professional?.specialty || "Consulta"}
      </Text>
      {professional?.name && (
        <Text className="text-sm text-textFifth">{professional.name}</Text>
      )}

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
    </Pressable>
  );
}
