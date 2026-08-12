import Header from "@/src/components/header/header";
import { ExamSchedulingBooking } from "@/src/features/exam-scheduling-booking/exam-scheduling-booking";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExamSchedulingBookingScreen() {
  const { unitId, offeringId } = useLocalSearchParams<{
    unitId: string;
    offeringId: string;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-bgPrimary">
      <Header text="Agendar Exame" />
      <ExamSchedulingBooking
        healthUnitId={unitId ?? ""}
        offeringId={offeringId ?? ""}
      />
    </SafeAreaView>
  );
}
