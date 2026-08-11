import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { Image } from "expo-image";
import { MapPin } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface HealthUnitResultsListProps {
  units?: IHealthUnit[];
  isLoading?: boolean;
  onSelect: (unitId: string) => void;
}

export function HealthUnitResultsList({
  units,
  isLoading,
  onSelect,
}: HealthUnitResultsListProps) {
  if (isLoading) {
    return (
      <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
        <Text className="text-sm text-textFourth">Buscando clínicas...</Text>
      </View>
    );
  }

  if (!units || units.length === 0) {
    return (
      <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
        <Text className="text-sm text-textFourth">
          Nenhuma clínica encontrada.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {units.map((unit) => (
        <Pressable
          key={unit._id}
          onPress={() => onSelect(unit._id)}
          className="flex-row gap-3 rounded-2xl border border-[#E7ECEF] bg-bgThird p-3"
        >
          <View className="h-16 w-16 overflow-hidden rounded-xl bg-[#E2E8F0]">
            {unit.img ? (
              <Image
                source={{ uri: unit.img }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <Image
                source={require("@/assets/images/Hospital.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            )}
          </View>

          <View className="flex-1 justify-center gap-1">
            <Text
              className="text-base font-bold text-textBlack"
              numberOfLines={1}
            >
              {unit.name}
            </Text>
            <View className="flex-row items-center gap-1">
              <MapPin size={12} color="#A8A8A8" />
              <Text
                className="flex-1 text-xs text-textFourth"
                numberOfLines={1}
              >
                {unit.address.street}, {unit.address.number} -{" "}
                {unit.address.neighborhood}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
