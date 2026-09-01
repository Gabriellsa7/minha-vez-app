import { IExamBooking } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatExamDateTime } from "@/src/utils/exam-scheduling.util";
import { CalendarClock, MapPin, TestTube } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { getVisitUrgency, UrgencyBadge } from "./visit-urgency";

const CARD_WIDTH = 260;

interface ExamBookingCardProps {
  exam: IExamBooking;
  date: Date;
  now: Date;
  onPress: (examBooking: IExamBooking) => void;
  fullWidth?: boolean;
}

export default function ExamBookingCard({
  exam,
  date,
  now,
  onPress,
  fullWidth,
}: ExamBookingCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ver informações do exame"
      onPress={() => onPress(exam)}
      style={fullWidth ? undefined : { width: CARD_WIDTH }}
      className={`rounded-2xl border border-borderPrimary bg-bgThird p-3 ${fullWidth ? "w-full" : ""}`}
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
  );
}
