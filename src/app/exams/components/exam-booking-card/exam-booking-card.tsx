import {
  IExamBooking,
  isExamResultAvailable,
} from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatExamDateTime } from "@/src/utils/exam-scheduling.util";
import { router } from "expo-router";
import { CalendarClock, MapPin } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { STATUS_BG, STATUS_LABEL, STATUS_TEXT } from "../../util";

interface ExamBookingCardProps {
  booking: IExamBooking;
}

export function ExamBookingCard({ booking }: ExamBookingCardProps) {
  const hasResult = isExamResultAvailable(booking);
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/exam-scheduling/booking/${booking._id}`)}
      className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
    >
      <View className="flex-row items-start justify-between gap-2">
        <Text className="flex-1 text-base font-semibold text-textBlack">
          {booking.examOfferingName}
        </Text>
        <View className={`rounded-full px-3 py-1 ${STATUS_BG[booking.status]}`}>
          <Text
            className={`text-xs font-semibold ${STATUS_TEXT[booking.status]}`}
          >
            {hasResult ? "Resultado disponível" : STATUS_LABEL[booking.status]}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <CalendarClock size={14} color={colors.textFourth} />
        <Text className="text-xs text-textFourth">
          {formatExamDateTime(booking.scheduledAt)}
        </Text>
      </View>

      <View className="mt-1 flex-row items-center gap-2">
        <MapPin size={14} color={colors.textFourth} />
        <Text className="text-xs text-textFourth" numberOfLines={1}>
          {booking.healthUnitName}
        </Text>
      </View>
    </Pressable>
  );
}
