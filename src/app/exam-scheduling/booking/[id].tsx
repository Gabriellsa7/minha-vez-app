import Header from "@/src/components/header/header";
import { ExamBookingDetail } from "@/src/features/exam-booking-detail/exam-booking-detail";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExamBookingDetailScreen() {
  const { id, fromBooking } = useLocalSearchParams<{
    id: string;
    fromBooking?: string;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header
        text="Exame Agendado"
        backHref={fromBooking === "1" ? "/home" : undefined}
      />
      <ExamBookingDetail bookingId={id ?? ""} />
    </SafeAreaView>
  );
}
