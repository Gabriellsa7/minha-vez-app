import { useGetHealthUnitRatingSummary } from "@/src/api/get-health-unit-rating-summary";
import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin, Star } from "lucide-react-native/icons";
import { Pressable, ScrollView, Text, View } from "react-native";

interface HealthUnitsProps {
  healthUnits?: IHealthUnit[];
}

export default function HealthUnits({ healthUnits }: HealthUnitsProps) {
  return (
    <View className="mt-5 gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-textBlack">UBS & Clinicas</Text>
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
            <HealthUnitHomeCard key={unit._id} unit={unit} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

interface HealthUnitHomeCardProps {
  unit: IHealthUnit;
}

function HealthUnitHomeCard({ unit }: HealthUnitHomeCardProps) {
  const { data: rating } = useGetHealthUnitRatingSummary({
    healthUnitId: unit._id,
  });
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => router.push(`/health-unit-info/${unit._id}`)}
      className="w-56 h-auto bg-bgThird rounded-xl"
    >
      <View className="w-64 h-56 bg-bgThird rounded-xl p-4">
        {/* add a default image, this image is on figma */}
        <View className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-borderPrimary">
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

          {rating && rating.count > 0 && (
            <View className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full bg-bgThird px-2 py-1">
              <Star size={12} color={colors.accentStar} fill={colors.accentStar} />
              <Text className="text-xs font-semibold text-textBlack">
                {rating.average?.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        <Text className="font-bold text-lg text-textBlack">{unit.name}</Text>
        <View className="flex-row items-center gap-2">
          <MapPin size={12} color={colors.textFourth} />
          <Text className="text-sm text-textFourth">
            {unit.address.street}, {unit.address.number}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
