import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { ScrollView, Text, View } from "react-native";

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
  );
}
