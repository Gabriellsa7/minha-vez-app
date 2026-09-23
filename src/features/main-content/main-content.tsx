import { useGetHealthUnits } from "@/src/api/get-health-units";
import SearchInput from "@/src/components/search-input/search-input";
import { IAppointment } from "@/src/config/entities/appointments/appointments.types";
import { IExamBooking } from "@/src/config/entities/exam-bookings/exam-bookings.type";
import { IPatient } from "@/src/config/entities/patients/patients.type";
import { IUser } from "@/src/config/entities/user/user.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useBottomTabBarHeight } from "expo-router/build/react-navigation/bottom-tabs";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import HomeHeader from "./components/header/header";
import { HomeAlerts } from "./components/home-alerts/home-alerts";
import HealthUnits from "./components/health-units/health-units";
import { NextVisitBanner } from "./components/next-visit-banner/next-visit-banner";
import { QueueStatusCard } from "./components/queue-status-card/queue-status-card";
import { QuickServices } from "./components/quick-services/quick-services";
import UpcomingVisits from "./components/upcoming-visits/upcoming-visits";
import { useHomeVisits } from "./hooks/use-home-visits";
import { useMedicalInfoReminder } from "./hooks/use-medical-info-reminder";

interface MainContentProps {
  user: IUser;
  patient?: IPatient | null;
}

const openQueue = (queueId: string) => {
  router.push({ pathname: "/queue-info/[id]", params: { id: queueId } });
};

const openExamBooking = (examBooking: IExamBooking) => {
  router.push(`/exam-scheduling/booking/${examBooking._id}`);
};

export default function MainContent({ user, patient }: MainContentProps) {
  const colors = useThemeColors();
  const tabBarHeight = useBottomTabBarHeight();
  const patientId = patient?._id;

  const { data: healthUnits } = useGetHealthUnits();
  const {
    isAppointmentsLoading,
    upcomingAppointments,
    upcomingExamBookings,
    nextAppointment,
    nextUpcomingVisit,
    hasScheduledAppointment,
    hasRevealedActiveQueueItem,
    getQueueIdForAppointment,
  } = useHomeVisits(patientId);
  const needsMedicalInfoReminder = useMedicalInfoReminder(patient);

  const handleUpcomingVisitPress = () => {
    if (!nextUpcomingVisit) return;

    if (nextUpcomingVisit.type === "exam") {
      openExamBooking(nextUpcomingVisit.examBooking);
      return;
    }

    const queueId = getQueueIdForAppointment(nextUpcomingVisit.appointment);
    if (queueId) openQueue(queueId);
  };

  const handlePressAppointment = (appointment: IAppointment) => {
    const queueId = getQueueIdForAppointment(appointment);

    if (!queueId) {
      Toast.show({
        type: "info",
        text1: "Fila ainda não disponível",
        text2: "A fila desta consulta será aberta no dia do atendimento.",
      });
      return;
    }

    openQueue(queueId);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
    >
      <View className="items-center justify-center bg-bgPrimary">
        <LinearGradient
          colors={[colors.bgFourth, colors.bgSecondary]}
          style={{ width: "100%", gap: 12, paddingBottom: 20 }}
        >
          <View className="w-full gap-3 p-5">
            <HomeHeader user={user} />
            <QueueStatusCard
              patientId={patientId}
              isLoading={isAppointmentsLoading}
              hasActiveQueueItem={hasRevealedActiveQueueItem}
              scheduledAppointment={
                hasScheduledAppointment ? nextAppointment : undefined
              }
            />
          </View>
        </LinearGradient>
        <View className="relative mb-6 w-full">
          <View className="absolute -bottom-6 left-5 right-5">
            <SearchInput
              placeholder="Buscar clínica ou especialidade"
              onPress={() => router.push("/search")}
            />
          </View>
        </View>

        <View className="w-full gap-5 p-5">
          <HomeAlerts
            hasPatientProfile={Boolean(patient)}
            needsMedicalInfoReminder={needsMedicalInfoReminder}
          />
          {nextUpcomingVisit && (
            <NextVisitBanner
              visit={nextUpcomingVisit}
              onPress={handleUpcomingVisitPress}
            />
          )}
          <UpcomingVisits
            appointments={upcomingAppointments}
            healthUnits={healthUnits}
            onPressAppointment={handlePressAppointment}
            examBookings={upcomingExamBookings}
            onPressExam={openExamBooking}
          />
          <QuickServices />
          <HealthUnits healthUnits={healthUnits} />
        </View>
      </View>
    </ScrollView>
  );
}
