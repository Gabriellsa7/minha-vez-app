import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { isToday, weekDayLabel } from "@/src/utils/util";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Bone, Clock, MapPin } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

export default function HealthUnitInfo() {
  const { id } = useLocalSearchParams();

  const { data: healthUnit } = useGetHealthUnitById({
    healthUnitId: id as string,
  });
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="p-4 gap-6">
        <View>
          <View className=" h-64 w-full overflow-hidden rounded-xl bg-bgThird">
            {healthUnit?.img ? (
              <Image
                source={{ uri: healthUnit.img }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <Image
                source={require("../../../assets/images/Hospital.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            )}
          </View>
        </View>
        <View className="bg-bgThird gap-4 p-4 rounded-xl">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-textBlack">
              {healthUnit?.name}
            </Text>
            <Text className="leading-6 text-textFifth">
              {healthUnit?.description}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="bg-[#DDF4F7] p-2 rounded-xl">
              <MapPin size={20} color="#006673" />
            </View>

            <View className="flex-1">
              <Text className="text-text-textBlack text-xl font-medium">
                Endereço
              </Text>

              <Text className="text-textFifth mt-1 leading-5">
                {healthUnit?.address.street}, {healthUnit?.address.number} -{" "}
                {healthUnit?.address.neighborhood}
                {healthUnit?.address.city} - {healthUnit?.address.state}
              </Text>
            </View>
          </View>
          <View className="flex gap-2">
            <View className="flex-row items-center gap-2">
              <View className="bg-[#DDF4F7] p-2 rounded-xl">
                <Clock size={22} color="#006673" />
              </View>
              <Text className="text-text-textBlack text-xl font-medium">
                Horários de funcionamento
              </Text>
            </View>
            <View className="gap-2">
              {healthUnit?.openingHours.map((openingHour) => (
                <View
                  key={openingHour.day}
                  className={`flex-row items-center justify-between rounded-2xl px-4 py-4 border ${
                    isToday(openingHour.day)
                      ? "bg-[#EAF9FB] border-[#0B7A87]"
                      : "bg-bgPrimary border-[#E6ECEE]"
                  }`}
                >
                  <View>
                    <Text className="font-semibold text-base text-textBlack">
                      {weekDayLabel[openingHour.day]}
                    </Text>

                    {isToday(openingHour.day) && (
                      <Text className="text-xs text-[#0B7A87] font-medium">
                        Hoje
                      </Text>
                    )}
                  </View>
                  {openingHour.isClosed ? (
                    <View className="bg-red-100 px-3 py-1 rounded-full">
                      <Text className="text-red-600 font-semibold text-xs">
                        Fechado
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-[#DDF4F7] px-3 py-2 rounded-full">
                      <Text className="font-bold text-[#0B7A87]">
                        {openingHour.open} - {openingHour.close}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View className="bg-[#EEF9FB] border border-[#D2E8EC] rounded-2xl p-5 gap-3">
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-3xl bg-[#0B7A87]" />
            <Text className="text-[#0B7A87] font-bold tracking-widest uppercase text-sm">
              Queue Pulse
            </Text>
          </View>

          <Text className="text-base text-textBlack">
            Tempo médio de espera:{" "}
            <Text className="font-bold text-[#0B7A87]">15 min</Text>
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold">Serviços Oferecidos</Text>
          <Text className="text-textSecondary font-medium">Ver todos</Text>
        </View>
        <View className="gap-4">
          {healthUnit?.services.map((health) => (
            <View
              className="bg-bgThird rounded-2xl p-5 gap-4 border border-[#E7ECEF]"
              key={health._id}
            >
              <View className="flex-row gap-4 items-start">
                <View className="bg-[#DDF4F7] p-3 rounded-xl">
                  <Bone size={24} color="#0B7A87" />
                </View>

                <View className="flex-1 gap-1">
                  <Text className="font-bold text-lg text-textBlack">
                    {health.name}
                  </Text>

                  <Text className="text-textFifth leading-5">
                    {health.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
