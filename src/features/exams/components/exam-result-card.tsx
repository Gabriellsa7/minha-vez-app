import { IExam } from "@/src/config/entities/exams/exams.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router } from "expo-router";
import { CalendarClock, MapPin, Stethoscope } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ExamResultCardProps {
  exam: IExam;
}

export default function ExamResultCard({ exam }: ExamResultCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/exams/${exam._id}`)}
      className="mb-3 rounded-2xl border border-borderPrimary bg-bgThird p-4"
    >
      <Text className="text-base font-semibold text-textBlack">
        {exam.examType}
      </Text>

      {exam.examDate && (
        <View className="mt-3 flex-row items-center gap-2">
          <CalendarClock size={14} color={colors.textFourth} />
          <Text className="text-xs text-textFourth">
            {new Date(exam.examDate).toLocaleDateString("pt-BR")}
          </Text>
        </View>
      )}

      {exam.doctorName && (
        <View className="mt-1 flex-row items-center gap-2">
          <Stethoscope size={14} color={colors.textFourth} />
          <Text className="text-xs text-textFourth" numberOfLines={1}>
            {exam.doctorName}
          </Text>
        </View>
      )}

      {exam.healthUnitName && (
        <View className="mt-1 flex-row items-center gap-2">
          <MapPin size={14} color={colors.textFourth} />
          <Text className="text-xs text-textFourth" numberOfLines={1}>
            {exam.healthUnitName}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
