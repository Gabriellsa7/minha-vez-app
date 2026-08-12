import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { generateTimes, getDateTimeFromDateAndTime } from "@/src/utils/util";
import { Clock3 } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

const TIME_SLOTS_GRID_HEIGHT = 136;

interface AvaliableTimesProps {
  selectedDate: string;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  bookedTimes: Set<string>;
  isProfessionalAppointmentsLoading: boolean;
  professional: IHealthProfessional;
}

export default function AvaliableTimes({
  selectedDate,
  selectedTime,
  setSelectedTime,
  bookedTimes,
  professional,
  isProfessionalAppointmentsLoading,
}: AvaliableTimesProps) {
  const AVAILABLE_TIMES = [
    ...generateTimes(
      professional.schedule.morning?.start || "",
      professional.schedule.morning?.end || "",
      professional.schedule.appointmentDuration,
    ),

    ...generateTimes(
      professional.schedule.afternoon?.start || "",
      professional.schedule.afternoon?.end || "",
      professional.schedule.appointmentDuration,
    ),
  ];
  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-[#0F172A]">
        Horários disponíveis
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          className="flex-col flex-wrap gap-2"
          style={{ height: TIME_SLOTS_GRID_HEIGHT }}
        >
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
                    isUnavailable
                      ? "#94A3B8"
                      : isSelected
                        ? "#FFFFFF"
                        : "#008096"
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
      </ScrollView>
    </View>
  );
}
