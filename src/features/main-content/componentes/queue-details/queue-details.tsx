import { ArrowRight, Smile } from "lucide-react-native";
import { Dimensions, ScrollView, Text, View } from "react-native";

import { useGetQueueItemByPatientId } from "@/src/api/get-queue-item-by-patient-id";
import { useGetQueuesWithDetailsByPatientId } from "@/src/api/get-queues-with-details-by-patient-id";
import { useState } from "react";

interface QueueDetailsProps {
  patientId: string;
}

export default function QueueDetails({ patientId }: QueueDetailsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { width } = Dimensions.get("window");

  const CARD_WIDTH = width * 0.9;

  const { data: queueDetails } = useGetQueuesWithDetailsByPatientId(
    {
      patientId: patientId || "",
    },
    {
      enabled: !!patientId,
    },
  );

  const { data: queueItem } = useGetQueueItemByPatientId(
    {
      patientId: patientId || "",
    },
    {
      enabled: !!patientId,
    },
  );
  return (
    <View className="gap-2">
      <Text className="text-textThird text-sm">Filas Ativas</Text>
      <View className="flex-row" style={{ width, overflow: "hidden" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x /
                event.nativeEvent.layoutMeasurement.width,
            );
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
          snapToInterval={CARD_WIDTH}
        >
          {queueDetails &&
            queueDetails.map((item) => {
              const patientQueueItem = queueItem?.find(
                (queue) => queue.queueId === item._id,
              );
              return (
                <View style={{ width }} key={item._id}>
                  <View className="w-[90%] flex-row items-center justify-between bg-[#0092AA] p-3 rounded-t-xl">
                    <View className="flex-row items-center gap-2">
                      <View className="rounded-full bg-bgSecondary p-2">
                        {/* Clinic Image */}
                        <Smile color="#FFFFFF" size={24} />
                      </View>
                      <View className="gap-1">
                        <Text className="text-textPrimary">
                          {item.healthUnitName}
                        </Text>
                        <Text className="text-textPrimary text-sm opacity-50">
                          Atual Fila {patientQueueItem?.position || "N/A"} de{" "}
                          {item.queueSize}
                        </Text>
                      </View>
                    </View>
                    <ArrowRight size={28} color="#FFFFFF" />
                  </View>
                  <View className="bg-bgPrimary rounded-b-xl p-3 w-[90%]">
                    <View className="border border-[#D8D8D8] gap-1 p-3 rounded-xl">
                      <Text className="font-bold text-xl">
                        Posição {patientQueueItem?.position || "N/A"}
                      </Text>
                      <Text className="text-textFourth text-sm">
                        Código #{patientQueueItem?.code || null}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
      <View className="flex-row gap-2 mt-2 justify-center">
        {[0, 1].map((_, index) => (
          <View
            key={index}
            style={{
              width: activeIndex === index ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: activeIndex === index ? "#FFF" : "#FFF",
            }}
          />
        ))}
      </View>
    </View>
  );
}
