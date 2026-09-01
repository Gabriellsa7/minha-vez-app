import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IExamBooking } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import AppointmentCard from "./appointment-card";
import ExamBookingCard from "./exam-booking-card";
import {
  getVisibleVisits,
  MAX_VISIBLE_VISIT_CARDS,
} from "./upcoming-visits.util";

interface UpcomingVisitsProps {
  appointments: IAppointment[];
  healthUnits?: IHealthUnit[];
  onPressAppointment: (appointment: IAppointment) => void;
  examBookings: IExamBooking[];
  onPressExam: (examBooking: IExamBooking) => void;
}

export default function UpcomingVisits({
  appointments,
  healthUnits,
  onPressAppointment,
  examBookings,
  onPressExam,
}: UpcomingVisitsProps) {
  const [now, setNow] = useState(() => new Date());

  const visits = getVisibleVisits(appointments, examBookings, now);
  const visibleVisits = visits.slice(0, MAX_VISIBLE_VISIT_CARDS);

  useEffect(() => {
    if (visits.length === 0) return;

    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [visits.length]);

  if (visits.length === 0) {
    return null;
  }

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-textThird text-base">
          Consultas e exames marcados
        </Text>
        <Pressable onPress={() => router.push("/upcoming-visits")}>
          <Text className="text-sm text-textThird">Ver todos</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {visibleVisits.map((visit) =>
          visit.type === "appointment" ? (
            <AppointmentCard
              key={visit.appointment._id}
              appointment={visit.appointment}
              healthUnits={healthUnits}
              now={now}
              onPress={onPressAppointment}
            />
          ) : (
            <ExamBookingCard
              key={visit.exam._id}
              exam={visit.exam}
              date={visit.date}
              now={now}
              onPress={onPressExam}
            />
          ),
        )}
      </ScrollView>
    </View>
  );
}
