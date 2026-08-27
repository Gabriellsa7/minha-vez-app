import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ExamClinicListItemProps {
  unit: IHealthUnit;
}

export default function ExamClinicListItem({ unit }: ExamClinicListItemProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => router.push(`/exam-scheduling/${unit._id}`)}
      className="flex-row gap-3 rounded-2xl border border-borderPrimary bg-bgThird p-3"
    >
      <View className="h-20 w-20 overflow-hidden rounded-xl bg-borderPrimary">
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

      <View className="flex-1 justify-center gap-1">
        <Text className="text-base font-bold text-textBlack" numberOfLines={1}>
          {unit.name}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPin size={12} color={colors.textFourth} />
          <Text className="flex-1 text-xs text-textFourth" numberOfLines={1}>
            {unit.address.street}, {unit.address.number} -{" "}
            {unit.address.neighborhood}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
