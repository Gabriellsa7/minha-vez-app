import { useGetAppointmentRatingEligibility } from "@/src/api/get-appointment-rating-eligibility";
import {
  EAppointmentStatus,
  IAppointment,
} from "@/src/config/entities/appointments/appointments.types";
import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { CalendarClock, MapPin, Star } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { STATUS_BG, STATUS_LABEL, STATUS_TEXT } from "../../util";

interface HistoryAppointmentCardProps {
  appointment: IAppointment;
  professional?: IHealthProfessional;
  unit?: IHealthUnit;
  onRate: () => void;
}

export default function HistoryAppointmentCard({
  appointment,
  professional,
  unit,
  onRate,
}: HistoryAppointmentCardProps) {
  const { data: eligibility } = useGetAppointmentRatingEligibility(
    { appointmentId: appointment._id },
    { enabled: appointment.status === EAppointmentStatus.COMPLETED },
  );

  const canRate = Boolean(
    eligibility?.canRateProfessional || eligibility?.canRateClinic,
  );
  const colors = useThemeColors();

  return (
    <View className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-textBlack">
            {professional?.specialty || "Consulta"}
          </Text>
          {professional?.name && (
            <Text className="text-sm text-textFifth">{professional.name}</Text>
          )}
        </View>
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

      {canRate && (
        <Pressable
          accessibilityRole="button"
          onPress={onRate}
          className="mt-3 flex-row items-center justify-center gap-2 self-start rounded-full bg-bgSecondary px-4 py-2"
        >
          <Star
            size={14}
            color={colors.textPrimary}
            fill={colors.textPrimary}
          />
          <Text className="text-xs font-semibold text-textPrimary">
            Avaliar atendimento
          </Text>
        </Pressable>
      )}
    </View>
  );
}
