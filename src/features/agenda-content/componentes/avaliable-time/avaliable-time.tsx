import { getDateTimeFromDateAndTime } from "@/src/utils/util";
import { Clock3 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface AvaliableTimesProps {
  selectedDate: string;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  bookedTimes: Set<string>;
  isProfessionalAppointmentsLoading: boolean;
}

export default function AvaliableTimes({
  selectedDate,
  selectedTime,
  setSelectedTime,
  bookedTimes,
  isProfessionalAppointmentsLoading,
}: AvaliableTimesProps) {
  const AVAILABLE_TIMES = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-[#0F172A]">
        Horários disponíveis
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {AVAILABLE_TIMES.map((time) => {
          const isSelected = selectedTime === time;
          const isBooked = bookedTimes.has(time);
          const isPast =
            selectedDate &&
            getDateTimeFromDateAndTime(selectedDate, time) <= new Date();
          const isUnavailable =
            isBooked || isPast || isProfessionalAppointmentsLoading;

          return (
            <Pressable
              key={time}
              onPress={() => setSelectedTime(time)}
              disabled={isUnavailable}
              className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
                isUnavailable
                  ? "border-[#E2E8F0] bg-[#F1F5F9] opacity-60"
                  : isSelected
                    ? "border-[#008096] bg-[#008096]"
                    : "border-[#D7EEF2] bg-white"
              }`}
            >
              <Clock3
                size={16}
                color={
                  isUnavailable ? "#94A3B8" : isSelected ? "#FFFFFF" : "#008096"
                }
              />
              <Text
                className={`text-sm ${
                  isUnavailable
                    ? "text-[#94A3B8]"
                    : isSelected
                      ? "text-white"
                      : "text-[#0F172A]"
                }`}
              >
                {time}
              </Text>
              {(isBooked || isPast) && (
                <Text className="text-xs font-medium text-[#94A3B8]">
                  {isBooked ? "Ocupado" : "Indisponível"}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
