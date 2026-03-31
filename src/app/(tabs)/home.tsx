import { useGetAppointmentsByPatientId } from "@/src/api/get-appointment-by-patient-id";
import { useGetHealthUnits } from "@/src/api/get-health-units";
import { useGetPatientById } from "@/src/api/get-patient-by-id";
import { useGetUser } from "@/src/api/get-user-me";
import { QuickServices } from "@/src/features/home/quick-services";
import { formatDateTime } from "@/src/utils/format-date-time";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Bell,
  Clock,
  Info,
  Search,
  Smile,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { width } = Dimensions.get("window");

  const { data: user } = useGetUser();

  const { data: healthUnits } = useGetHealthUnits();

  const { data: patient } = useGetPatientById(
    { userId: user?._id || "" },
    {
      enabled: !!user?._id,
    },
  );

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

  if (isAppointmentsLoading) {
    console.log("Carregando appointments...");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="items-center justify-center">
        <LinearGradient
          colors={["#006579", "#008096"]}
          style={{ width: "100%", gap: 12, paddingBottom: 20 }}
        >
          <View className="w-full gap-3 p-5">
            <View className="flex-row items-center justify-between pb-2">
              <View className="gap-3 flex-row items-center">
                {/* User Profile Image */}
                <User size={32} color="#FFFFFF" />
                <View>
                  <Text className="text-textPrimary font-bold text-xl">
                    Bom dia, {user?.name || "User"}
                  </Text>
                  <Text className="text-textThird">Permita-nós ajuda-lo</Text>
                </View>
              </View>
              <View className="gap-3 flex-row">
                <View className="rounded-full bg-bgSecondary p-2">
                  <Bell size={24} color="#FFFFFF" />
                </View>
                <View className="rounded-full bg-bgSecondary p-2">
                  <Info size={24} color="#FFFFFF" />
                </View>
              </View>
            </View>
            <View className="gap-2">
              <Text className="text-textThird text-sm">Filas Ativas</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x /
                      event.nativeEvent.layoutMeasurement.width,
                  );
                  setActiveIndex(index);
                }}
                scrollEventThrottle={16}
              >
                <View style={{ width }}>
                  <View className="w-[90%] flex-row items-center justify-between bg-[#0092AA] p-3 rounded-t-xl">
                    <View className="flex-row items-center gap-2">
                      <View className="rounded-full bg-bgSecondary p-2">
                        {/* Clinic Image */}
                        <Smile color="#FFFFFF" size={24} />
                      </View>
                      <View className="gap-1">
                        <Text className="text-textPrimary">
                          Fila da Clinica Ortopedica
                        </Text>
                        <Text className="text-textPrimary text-sm opacity-50">
                          Atual Fila 5 de 20
                        </Text>
                      </View>
                    </View>
                    <ArrowRight size={28} color="#FFFFFF" />
                  </View>
                  <View className="bg-bgPrimary rounded-b-xl p-3 w-[90%]">
                    <View className="border border-[#D8D8D8] gap-1 p-3 rounded-xl">
                      <Text className="font-bold text-xl">Posição 6</Text>
                      <Text className="text-textFourth text-sm">
                        Sua vez 11:12 #YU78
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View className="flex-row gap-2 mt-2 justify-center">
                {[0, 1].map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: activeIndex === index ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: activeIndex === index ? "#FFF" : "#FFF",
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
        <View className="relative w-full mb-6">
          <View className="absolute -bottom-6 left-5 right-5">
            <View className="flex-row items-center gap-2 bg-bgPrimary px-5 py-1 rounded-2xl">
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
          {userAppointments && (
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
    </SafeAreaView>
  );
}
