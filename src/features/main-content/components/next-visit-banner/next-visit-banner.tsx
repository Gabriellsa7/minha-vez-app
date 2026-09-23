import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatExamDateTime } from "@/src/utils/exam-scheduling.util";
import { formatDateTime } from "@/src/utils/format-date-time";
import { Bell, Clock, TestTube } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { NextUpcomingVisit } from "../../hooks/use-home-visits";

interface NextVisitBannerProps {
  visit: NextUpcomingVisit;
  onPress: () => void;
}

export function NextVisitBanner({ visit, onPress }: NextVisitBannerProps) {
  const colors = useThemeColors();
  const isExam = visit.type === "exam";
  const Icon = isExam ? TestTube : Bell;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isExam ? "Ver informações do exame" : "Ver informações da consulta"
      }
      onPress={onPress}
      className="min-h-[48px] w-full flex-row items-center justify-between rounded-lg bg-bgSecondary px-3 py-3"
    >
      <View className="mr-2 flex-1 flex-row items-center gap-2">
        <Icon size={20} color={colors.textPrimary} />
        <Text className="flex-shrink text-textPrimary">
          {isExam
            ? `Próximo exame: ${visit.examBooking.examOfferingName}`
            : "Sua próxima consulta"}
        </Text>
      </View>
      <View className="flex-shrink-0 flex-row items-center gap-2">
        <Text className="text-textPrimary">
          {isExam
            ? formatExamDateTime(visit.examBooking.scheduledAt)
            : formatDateTime(visit.appointment.dateTime)}
        </Text>
        <Clock size={20} color={colors.textPrimary} />
      </View>
    </Pressable>
  );
}
