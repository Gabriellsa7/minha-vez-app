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
        <Pressable onPress={() => router.push("/health-units")}>
          <Text className="text-sm text-textThird">Ver todas</Text>
        </Pressable>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 42 }}
        >
          {healthUnits?.slice(0, 4).map((unit) => (
            <Pressable
              key={unit._id}
              onPress={() => router.push(`/health-unit-info/${unit._id}`)}
              className="w-56 h-auto bg-bgThird rounded-xl"
            >
              <View
                key={unit._id}
                className="w-64 h-56 bg-bgThird rounded-xl p-4"
              >
                {/* add a default image, this image is on figma */}
                <View className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-[#E2E8F0]">
                  {unit.img ? (
                    <Image
                      source={{ uri: unit.img }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : (
                    <Image
                      source={require("../../../../../assets/images/Hospital.png")}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
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
