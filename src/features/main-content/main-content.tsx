import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import SearchInput from "@/src/components/search-input/search-input";
import { IPatient } from "@/src/config/entities/patients/patients.type";
import { IUser } from "@/src/config/entities/user/user.types";
import { formatDateTime } from "@/src/utils/format-date-time";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Clock } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import HomeHeader from "./componentes/header/header";
import HealthUnits from "./componentes/health-units/health-units";
import QueueDetails from "./componentes/queue-details/queue-details";
import { QuickServices } from "./componentes/quick-services/quick-services";

interface MainContentProps {
  user: IUser;
  patient?: IPatient | null;
}

export default function MainContent({ user, patient }: MainContentProps) {
  const { data: healthUnits } = useGetHealthUnits();

  const tabBarHeight = useBottomTabBarHeight();

  const patientId = patient?._id;

  const { data: userAppointments, isLoading: isAppointmentsLoading } =
    useGetAppointmentsByPatientId(
      {
        patientId: patientId || "",
      },
      {
        enabled: !!patientId,
      },
    );

  const appointment = useMemo(() => {
    const now = new Date();

    return userAppointments
      ?.filter((item) => new Date(item.dateTime) > now)
      .sort(
        (first, second) =>
          new Date(first.dateTime).getTime() -
          new Date(second.dateTime).getTime(),
      )[0];
  }, [userAppointments]);

  if (isAppointmentsLoading) {
    console.log("Carregando appointments...");
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 20,
      }}
    >
      <View className="items-center justify-center">
        <LinearGradient
          colors={["#006579", "#008096"]}
          style={{ width: "100%", gap: 12, paddingBottom: 20 }}
        >
          <View className="w-full gap-3 p-5">
            <HomeHeader user={user!} />
            {appointment && <QueueDetails patientId={patientId!} />}
          </View>
        </LinearGradient>
        <View className="relative w-full mb-6">
          <View className="absolute -bottom-6 left-5 right-5">
            <SearchInput placeholder="Search doctor or clinic" />
          </View>
        </View>

        <View className="w-full p-5 gap-5">
          {!patient && (
            <View className="w-full rounded-[16px] border border-[#FDE68A] bg-[#FEF3C7] p-3">
              <Text className="text-sm font-medium text-[#92400E]">
                Complete seu cadastro para agendar consultas e acessar todos os
                recursos.
              </Text>
            </View>
          )}
          {appointment && (
            <View className="w-full flex-row items-center justify-between bg-[#008096] px-3 py-3 rounded-lg">
              <View className="flex-row gap-2 items-center">
                <Bell size={20} color="#FFFFFF" />
                <Text className=" text-textPrimary">
                  Seu proximo exame medico
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <Text className="text-textPrimary">
                  {formatDateTime(appointment?.dateTime)}
                </Text>
                <Clock size={20} color="#FFFFFF" />
              </View>
            </View>
          )}
          <QuickServices />
          <HealthUnits healthUnits={healthUnits} />
        </View>
      </View>
    </ScrollView>
  );
}
