import { IExamOfferingWithHealthUnit } from "@/src/config/entities/exam-offerings/exam-offerings.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ExamClinicOfferingCardProps {
  offering: IExamOfferingWithHealthUnit;
}

export function ExamClinicOfferingCard({
  offering,
}: ExamClinicOfferingCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push(`/exam-scheduling/${offering.healthUnitId}/${offering._id}`)
      }
      className="flex-row gap-3 rounded-2xl border border-borderPrimary bg-bgThird p-3"
    >
      <View className="h-20 w-20 overflow-hidden rounded-xl bg-borderPrimary">
        {offering.healthUnitImg ? (
          <Image
            source={{ uri: offering.healthUnitImg }}
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
          {offering.healthUnitName}
        </Text>
        <View className="flex-row items-center gap-1">
          <MapPin size={12} color={colors.textFourth} />
          <Text className="flex-1 text-xs text-textFourth" numberOfLines={1}>
            {offering.healthUnitAddress.street},{" "}
            {offering.healthUnitAddress.number} -{" "}
            {offering.healthUnitAddress.neighborhood}
          </Text>
        </View>
        {typeof offering.price === "number" && (
          <Text className="text-xs font-semibold text-textBlack">
            R$ {offering.price.toFixed(2).replace(".", ",")}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
