import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Clock, MapPin } from "lucide-react-native";
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
              <View className="flex-1 items-center justify-center">
                <Text className="text-sm text-textThird">Sem imagem</Text>
              </View>
            )}
          </View>
        </View>
        <View className="bg-bgThird gap-4 p-4 rounded-xl">
          <View>
            <Text className="text-textSecondary text-xl font-bold">
              {healthUnit?.name}
            </Text>
            <Text>
              {/*Add a logic to get the health unit description back and front and show Here*/}
              <Text className="text-textFifth">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint
                optio cum eos fugit pariatur incidunt, iste id delectus dicta,
                odit saepe?
              </Text>
            </Text>
          </View>
          <View className="flex-row gap-2 items-center">
            <MapPin size={24} color="#006673" />
            <Text>
              {healthUnit?.address.street}, {healthUnit?.address.number} -{" "}
              {healthUnit?.address.neighborhood} ,
            </Text>
            <Text>
              {healthUnit?.address.city} - {healthUnit?.address.state}
            </Text>
          </View>
          <View className="flex-row gap-2 items-center">
            {/* add logic to get the health unit opening hour in the back and front and show here */}
            <Clock size={24} color="#006673" />
            <Text> 08:00 - 18:00 (Seg-Sex)</Text>
          </View>
        </View>
        <View className="bg-[#EEF9FB] border border-[#D2E8EC] rounded-2xl p-5 gap-3">
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-3xl bg-[#0B7A87]" />
            <Text className="text-[#0B7A87] font-bold tracking-widest uppercase text-sm">
              Queue Pulse
            </Text>
          </View>

          {/* Think how can I get the waiting time in back and front */}
          <Text className="text-base text-textBlack">
            Tempo médio de espera:{" "}
            <Text className="font-bold text-[#0B7A87]">15 min</Text>
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold">Serviços Oferecidos</Text>
          <Text className="text-textSecondary font-medium">Ver todos</Text>
        </View>
        <View>
          {/* Think how kan jeg add a logic to show her the health unit service, back and front */}
          <Text>Serviços</Text>
        </View>
      </View>
    </ScrollView>
  );
}
