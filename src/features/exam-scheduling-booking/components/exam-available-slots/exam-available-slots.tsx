import { useGetExamSlots } from "@/src/api/get-exam-slots";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Clock3 } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const TIME_SLOTS_GRID_HEIGHT = 136;

interface ExamAvailableSlotsProps {
  healthUnitId: string;
  selectedDate: string;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export default function ExamAvailableSlots({
  healthUnitId,
  selectedDate,
  selectedTime,
  setSelectedTime,
}: ExamAvailableSlotsProps) {
  const colors = useThemeColors();
  const { data, isLoading } = useGetExamSlots(
    { healthUnitId, date: selectedDate },
    { enabled: Boolean(healthUnitId && selectedDate) },
  );

  const slots = data?.slots ?? [];

  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-textBlack">
        Horários disponíveis
      </Text>

      {isLoading ? (
        <ActivityIndicator color={colors.textSecondary} />
      ) : slots.length === 0 ? (
        <View className="rounded-2xl border border-dashed border-infoBorder bg-bgThird p-4">
          <Text className="text-sm text-textFourth">
            Nenhum horário disponível para esta data.
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            className="flex-col flex-wrap gap-2"
            style={{ height: TIME_SLOTS_GRID_HEIGHT }}
          >
            {slots.map((slot) => {
              const isSelected = selectedTime === slot.time;

              return (
                <Pressable
                  key={slot.time}
                  onPress={() => setSelectedTime(slot.time)}
                  className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
                    isSelected
                      ? "border-bgSecondary bg-bgSecondary"
                      : "border-infoBorder bg-bgThird"
                  }`}
                >
                  <Clock3
                    size={16}
                    color={isSelected ? colors.textPrimary : colors.textSecondary}
                  />
                  <Text
                    className={`text-sm ${
                      isSelected ? "text-textPrimary" : "text-textBlack"
                    }`}
                  >
                    {slot.time}
                  </Text>
                  {slot.remainingCapacity <= 2 && (
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? "text-textPrimary" : "text-textFourth"
                      }`}
                    >
                      {slot.remainingCapacity} vaga
                      {slot.remainingCapacity === 1 ? "" : "s"}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
