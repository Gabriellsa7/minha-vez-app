import { IExamOffering } from "@/src/config/entities/exam-offerings/exam-offerings.type";
import { router } from "expo-router";
import { Clock, Droplet } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ExamOfferingCardProps {
  offering: IExamOffering;
  healthUnitId: string;
}

export function ExamOfferingCard({
  offering,
  healthUnitId,
}: ExamOfferingCardProps) {
  return (
    <Pressable
      onPress={() =>
        router.push(`/exam-scheduling/${healthUnitId}/${offering._id}`)
      }
      className="gap-2 rounded-2xl border border-[#E7ECEF] bg-bgThird p-4"
    >
      <Text className="text-base font-bold text-textBlack">
        {offering.name}
      </Text>
      {offering.description && (
        <Text className="text-sm text-textFifth" numberOfLines={2}>
          {offering.description}
        </Text>
      )}
      <View className="flex-row flex-wrap items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Clock size={13} color="#006673" />
          <Text className="text-xs text-textSecondary">
            {offering.durationMinutes} min
          </Text>
        </View>
        {offering.requiresFasting && (
          <View className="flex-row items-center gap-1">
            <Droplet size={13} color="#006673" />
            <Text className="text-xs text-textSecondary">
              Jejum
              {offering.fastingHours ? ` de ${offering.fastingHours}h` : ""}
            </Text>
          </View>
        )}
        {typeof offering.price === "number" && (
          <Text className="text-xs font-semibold text-textBlack">
            R$ {offering.price.toFixed(2).replace(".", ",")}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
