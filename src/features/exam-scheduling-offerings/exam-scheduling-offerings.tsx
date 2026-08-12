import { useGetExamOfferingsByHealthUnitId } from "@/src/api/get-exam-offerings-by-health-unit-id";
import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { IExamOffering } from "@/src/config/entities/exam-offerings/exam-offerings.type";
import { router } from "expo-router";
import { Clock, Droplet, FlaskConical, MapPin } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

interface ExamSchedulingOfferingsProps {
  healthUnitId: string;
}

export function ExamSchedulingOfferings({
  healthUnitId,
}: ExamSchedulingOfferingsProps) {
  const { data: healthUnit } = useGetHealthUnitById({ healthUnitId });
  const { data: offerings, isLoading } = useGetExamOfferingsByHealthUnitId({
    healthUnitId,
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-bgPrimary">
      <View className="gap-5 p-5">
        <View className="rounded-2xl border border-[#E7ECEF] bg-bgThird p-4">
          <Text className="text-lg font-bold text-textBlack">
            {healthUnit?.name}
          </Text>
          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={12} color="#A8A8A8" />
            <Text className="flex-1 text-xs text-textFourth" numberOfLines={1}>
              {healthUnit?.address.street}, {healthUnit?.address.number} -{" "}
              {healthUnit?.address.neighborhood}
            </Text>
          </View>
        </View>

        <Text className="text-base font-semibold text-textBlack">
          Exames disponíveis
        </Text>

        {isLoading ? (
          <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
            <Text className="text-sm text-textFourth">
              Carregando exames...
            </Text>
          </View>
        ) : !offerings || offerings.length === 0 ? (
          <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
            <FlaskConical size={28} color="#0F766E" />
            <Text className="mt-3 text-center text-textFifth">
              Esta clínica ainda não oferece exames para agendamento.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {offerings.map((offering) => (
              <ExamOfferingCard
                key={offering._id}
                offering={offering}
                healthUnitId={healthUnitId}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function ExamOfferingCard({
  offering,
  healthUnitId,
}: {
  offering: IExamOffering;
  healthUnitId: string;
}) {
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
              Jejum{offering.fastingHours ? ` de ${offering.fastingHours}h` : ""}
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
