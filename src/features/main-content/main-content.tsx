import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { IPatient } from "@/src/config/entities/patients/patients.type";
import { IUser } from "@/src/config/entities/user/user.types";
import { formatDateTime } from "@/src/utils/format-date-time";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, Clock, Search } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import HomeHeader from "./componentes/header/header";
import QueueDetails from "./componentes/queue-details/queue-details";
import { QuickServices } from "./componentes/quick-services/quick-services";

interface MainContentProps {
  user: IUser;
  patient: IPatient;
}

export default function MainContent({ user, patient }: MainContentProps) {
  const { data: healthUnits } = useGetHealthUnits();

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

  const appointment = userAppointments?.[0];

  const now = new Date();

  const isFutureAppointment =
    appointment?.dateTime && new Date(appointment.dateTime) > now;

  if (isAppointmentsLoading) {
    console.log("Carregando appointments...");
  }

  return (
    <View className="items-center justify-center">
      <LinearGradient
        colors={["#006579", "#008096"]}
        style={{ width: "100%", gap: 12, paddingBottom: 20 }}
      >
        <View className="w-full gap-3 p-5">
          <HomeHeader user={user!} />
          <QueueDetails patientId={patientId!} />
        </View>
      </LinearGradient>
      <View className="relative w-full mb-6">
        <View className="absolute -bottom-6 left-5 right-5">
          <View className="flex-row items-center gap-2 bg-bgPrimary px-5 py-3 rounded-2xl">
            <Search size={18} color="#888" />
            <TextInput
              placeholder="Search doctor or clinic"
              placeholderTextColor="#888"
              className="flex-1 text-black"
            />
          </View>
        </View>
      </View>

      <View className="w-full p-5 gap-5">
        {userAppointments && isFutureAppointment && (
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
        <View className="mt-5 gap-3">
          <View className="flex-row items-center justify-between">
            <Text>UBS & Clinicas</Text>
            <Text className="text-sm text-textThird">See All</Text>
          </View>
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {healthUnits?.map((unit) => (
                <View
                  key={unit._id}
                  className="w-64 h-40 bg-[#F4F4F4] rounded-lg mr-4 p-3"
                >
                  <Text className="font-bold text-lg">{unit.name}</Text>
                  <Text className="text-sm text-textThird">
                    {unit.address.street}, {unit.address.number}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}
