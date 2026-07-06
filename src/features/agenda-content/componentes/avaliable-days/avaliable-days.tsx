import { getDateKey, isSameMonth, startOfDay } from "@/src/utils/util";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface AvaliableDaysProps {
  selectedDate: string;
  setSelectedTime: (time: string) => void;
  setSelectedDate: (date: string) => void;
}

export default function AvaliableDays({
  selectedDate,
  setSelectedTime,
  setSelectedDate,
}: AvaliableDaysProps) {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const calendarMonthLabel = useMemo(() => {
    const label = calendarMonth.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [calendarMonth]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    );
    const firstVisibleDay = new Date(firstDayOfMonth);
    firstVisibleDay.setDate(
      firstVisibleDay.getDate() - firstDayOfMonth.getDay(),
    );

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstVisibleDay);
      date.setDate(firstVisibleDay.getDate() + index);

      return date;
    });
  }, [calendarMonth]);

  const canGoToPreviousMonth = useMemo(() => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return calendarMonth > currentMonth;
  }, [calendarMonth]);

  const handleChangeCalendarMonth = (direction: "previous" | "next") => {
    setCalendarMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(
        currentMonth.getMonth() + (direction === "next" ? 1 : -1),
      );

      return nextMonth;
    });
  };

  return (
    <View className="mb-5">
      <Text className="mb-3 text-base font-semibold text-[#0F172A]">
        Escolha o dia
      </Text>
      <View className="rounded-[28px] bg-white p-5 shadow-sm">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-[#0F172A]">
            {calendarMonthLabel}
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => handleChangeCalendarMonth("previous")}
              disabled={!canGoToPreviousMonth}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                canGoToPreviousMonth ? "bg-[#F1F5F9]" : "bg-[#F8FAFC]"
              }`}
            >
              <ChevronLeft
                size={18}
                color={canGoToPreviousMonth ? "#008096" : "#CBD5E1"}
              />
            </Pressable>
            <Pressable
              onPress={() => handleChangeCalendarMonth("next")}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]"
            >
              <ChevronRight size={18} color="#008096" />
            </Pressable>
          </View>
        </View>

        <View className="mb-3 flex-row">
          {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((weekday) => (
            <Text
              key={weekday}
              className="flex-1 text-center text-[11px] font-semibold text-[#94A3B8]"
            >
              {weekday}
            </Text>
          ))}
        </View>

        <View className="flex-row flex-wrap">
          {calendarDays.map((day) => {
            const dateKey = getDateKey(day);
            const isCurrentMonth = isSameMonth(day, calendarMonth);
            const isSelected = selectedDate === dateKey;
            const isPastDay = startOfDay(day) < startOfDay(new Date());
            const isDisabled = !isCurrentMonth || isPastDay;

            return (
              <View
                key={dateKey}
                style={{
                  width: `${100 / 7}%`,
                  alignItems: "center",
                  paddingVertical: 4,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDate(dateKey);
                    setSelectedTime("");
                  }}
                  disabled={isDisabled}
                  activeOpacity={0.75}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? "#008096" : "transparent",
                  }}
                >
                  <Text
                    className={`text-sm ${
                      isSelected
                        ? "font-semibold text-white"
                        : isDisabled
                          ? "text-[#CBD5E1]"
                          : "text-[#0F172A]"
                    }`}
                  >
                    {day.getDate()}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
