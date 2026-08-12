import { useGetExamSlots } from "@/src/api/get-exam-slots";
import { Clock3 } from "lucide-react-native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

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
  const { data, isLoading } = useGetExamSlots(
    { healthUnitId, date: selectedDate },
    { enabled: Boolean(healthUnitId && selectedDate) },
  );

  const slots = data?.slots ?? [];

  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-[#0F172A]">
        Horários disponíveis
      </Text>

      {isLoading ? (
        <ActivityIndicator color="#008096" />
      ) : slots.length === 0 ? (
        <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
          <Text className="text-sm text-[#64748B]">
            Nenhum horário disponível para esta data.
          </Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time;

            return (
              <Pressable
                key={slot.time}
                onPress={() => setSelectedTime(slot.time)}
                className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
                  isSelected
                    ? "border-[#008096] bg-[#008096]"
                    : "border-[#D7EEF2] bg-white"
                }`}
              >
                <Clock3
                  size={16}
                  color={isSelected ? "#FFFFFF" : "#008096"}
                />
                <Text
                  className={`text-sm ${
                    isSelected ? "text-white" : "text-[#0F172A]"
                  }`}
                >
                  {slot.time}
                </Text>
                {slot.remainingCapacity <= 2 && (
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? "text-white" : "text-[#94A3B8]"
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
      )}
    </View>
  );
}
