import { IPrescription } from "@/src/config/entities/prescriptions/prescriptions.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { router } from "expo-router";
import {
  CalendarClock,
  CalendarPlus,
  MapPin,
  Stethoscope,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface PrescriptionCardProps {
  prescription: IPrescription;
}

export function PrescriptionCard({ prescription }: PrescriptionCardProps) {
  const colors = useThemeColors();

  const handleScheduleExam = () => {
    if (prescription.exams.length === 1) {
      router.push(
        `/exam-scheduling/${prescription.healthUnitId}/${prescription.exams[0].examOfferingId}`,
      );
      return;
    }

    router.push(`/prescriptions/${prescription._id}`);
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/prescriptions/${prescription._id}`)}
      className="mb-3 gap-2 rounded-2xl border border-borderPrimary bg-bgThird p-4"
    >
      <View className="flex-row items-center gap-2">
        <CalendarClock size={14} color={colors.textFourth} />
        <Text className="text-xs text-textFourth">
          {new Date(prescription.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Stethoscope size={14} color={colors.textFourth} />
        <Text
          className="flex-1 text-base font-semibold text-textBlack"
          numberOfLines={1}
        >
          {prescription.professionalName}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <MapPin size={14} color={colors.textFourth} />
        <Text className="flex-1 text-xs text-textFourth" numberOfLines={1}>
          {prescription.healthUnitName}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleScheduleExam}
        className="mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-bgSecondary py-2.5"
      >
        <CalendarPlus size={16} color={colors.textPrimary} />
        <Text className="text-sm font-semibold text-textPrimary">
          Marcar exame
        </Text>
      </Pressable>
    </Pressable>
  );
}
