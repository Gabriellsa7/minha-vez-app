import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native/icons";
import { Pressable, ScrollView, Text, View } from "react-native";

interface HealthUnitsProps {
  healthUnits?: IHealthUnit[];
}

export default function HealthUnits({ healthUnits }: HealthUnitsProps) {
  return (
    <View className="mt-5 gap-3">
      <View className="flex-row items-center justify-between">
        <Text>UBS & Clinicas</Text>
        <Text className="text-sm text-textThird">See All</Text>
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {healthUnits?.map((unit) => (
            <Pressable
              key={unit._id}
              onPress={() => router.push(`/health-unit-info/${unit._id}`)}
              className="w-64 h-64 bg-[#F4F4F4] rounded-lg mr-4 p-3"
            >
              <View
                key={unit._id}
                className="w-64 h-64 bg-[#F4F4F4] rounded-lg mr-4 p-3"
              >
                <View className="mb-3 h-32 w-full overflow-hidden rounded-md bg-[#E2E8F0]">
                  {unit.img ? (
                    <Image
                      source={{ uri: unit.img }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Text className="text-sm text-textThird">Sem imagem</Text>
                    </View>
                  )}
                </View>
                <Text className="font-bold text-lg">{unit.name}</Text>
                <View className="flex-row items-center gap-2">
                  <MapPin size={12} color="#A8A8A8" />
                  <Text className="text-sm text-textFourth">
                    {unit.address.street}, {unit.address.number}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
