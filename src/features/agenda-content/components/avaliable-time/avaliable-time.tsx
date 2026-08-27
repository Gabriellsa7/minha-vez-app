import { IHealthProfessional } from "@/src/config/entities/health-professional/health-professional.types";
import { IHealthUnitOpeningHours } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import {
  generateTimes,
  getDateTimeFromDateAndTime,
  getOpeningHoursForDateKey,
  isTimeWithinOpeningHours,
} from "@/src/utils/util";
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
  openingHours: IHealthUnitOpeningHours[];
}

export default function AvaliableTimes({
  selectedDate,
  selectedTime,
  setSelectedTime,
  bookedTimes,
  professional,
  isProfessionalAppointmentsLoading,
  openingHours,
}: AvaliableTimesProps) {
  const colors = useThemeColors();
  const dayOpeningHours = getOpeningHoursForDateKey(openingHours, selectedDate);
  const isUnitClosedToday =
    !dayOpeningHours ||
    dayOpeningHours.isClosed ||
    !dayOpeningHours.open ||
    !dayOpeningHours.close;

  const AVAILABLE_TIMES = isUnitClosedToday
    ? []
    : [
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
      ].filter((time) => isTimeWithinOpeningHours(openingHours, selectedDate, time));

  if (isUnitClosedToday) {
    return (
      <View className="mb-5">
        <Text className="mb-3 text-base font-semibold text-textBlack">
          Horários disponíveis
        </Text>
        <View className="rounded-[20px] border border-borderPrimary bg-bgPrimary p-4">
          <Text className="text-sm text-textFourth">
            A unidade de saúde não funciona neste dia.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-textBlack">
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
                    ? "border-borderPrimary bg-bgPrimary opacity-60"
                    : isSelected
                      ? "border-bgSecondary bg-bgSecondary"
                      : "border-infoBorder bg-bgThird"
                }`}
              >
                <Clock3
                  size={16}
                  color={
                    isUnavailable
                      ? colors.textFourth
                      : isSelected
                        ? colors.textPrimary
                        : colors.textSecondary
                  }
                />
                <Text
                  className={`text-sm ${
                    isUnavailable
                      ? "text-textFourth"
                      : isSelected
                        ? "text-textPrimary"
                        : "text-textBlack"
                  }`}
                >
                  {time}
                </Text>
                {(isBooked || isPast) && (
                  <Text className="text-xs font-medium text-textFourth">
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
