import { Image } from "expo-image";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";

import { useGetHealthProfessionalById } from "@/src/api/get-health-professional-by-id";
import { useGetQueueItemByPatientId } from "@/src/api/get-queue-item-by-patient-id";
import { useGetQueuesWithDetailsByPatientId } from "@/src/api/get-queues-with-details-by-patient-id";
import {
  EQueueItemStatus,
  IQueueItem,
} from "@/src/config/entities/queue-items/queue-items.types";
import { IQueueWithDetails } from "@/src/config/entities/queue/queue.type";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { formatDateTime } from "@/src/utils/format-date-time";
import { useState } from "react";

interface QueueDetailsProps {
  patientId: string;
}

const FINISHED_ITEM_STATUSES = [
  EQueueItemStatus.FINISHED,
  EQueueItemStatus.ABSENT,
  EQueueItemStatus.QUEUE_CLOSED,
];

export default function QueueDetails({ patientId }: QueueDetailsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const colors = useThemeColors();

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

  if (!queueDetails || !queueItem) {
    return null;
  }

  const activeQueues = queueDetails
    .filter((queue) => {
      // A Queue nasce com status CLOSED até o profissional abri-la; closedAt só é
      // preenchido quando ele efetivamente encerra o atendimento (queue.service.ts).
      if (queue.closedAt) return false;

      const patientQueueItem = queueItem.find(
        (item) => item.queueId === queue._id,
      );

      if (!patientQueueItem) return false;

      return !FINISHED_ITEM_STATUSES.includes(patientQueueItem.status);
    })
    .sort((a, b) => {
      return new Date(a.queueDate).getTime() - new Date(b.queueDate).getTime();
    });

  if (activeQueues.length === 0) {
    return null;
  }

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
          {activeQueues.map((item) => {
            const patientQueueItem = queueItem.find(
              (queue) => queue.queueId === item._id,
            );
            return (
              <QueueCard
                key={item._id}
                width={width}
                queue={item}
                patientQueueItem={patientQueueItem}
                colors={colors}
              />
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
              backgroundColor: colors.textPrimary,
            }}
          />
        ))}
      </View>
    </View>
  );
}

function QueueCard({
  width,
  queue,
  patientQueueItem,
  colors,
}: {
  width: number;
  queue: IQueueWithDetails;
  patientQueueItem?: IQueueItem;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const { data: professional } = useGetHealthProfessionalById(
    { professionalId: queue.professionalId },
    { enabled: !!queue.professionalId },
  );

  return (
    <View style={{ width }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver informações da fila"
        onPress={() =>
          router.push({
            pathname: "/queue-info/[id]",
            params: { id: queue._id },
          })
        }
        className="w-[90%] flex-row items-center justify-between bg-bgSecondary p-3 rounded-t-xl"
      >
        <View className="flex-row items-center gap-2">
          <View className="rounded-full overflow-hidden w-12 h-12">
            {queue.healthUnitImage ? (
              <Image
                source={{ uri: queue.healthUnitImage }}
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
          <View className="gap-1">
            <Text className="text-textPrimary">{queue.healthUnitName}</Text>
            <Text className="text-textPrimary text-sm opacity-50">
              Atual Fila {patientQueueItem?.position || "N/A"} de{" "}
              {queue.queueSize}
            </Text>
            <Text className="text-textPrimary text-sm opacity-50">
              Dia da consulta: {formatDateTime(queue.queueDate)}
            </Text>
            <Text className="text-textPrimary text-sm opacity-50">
              Sala: {professional?.room || "N/A"}
            </Text>
          </View>
        </View>
        <ArrowRight size={28} color={colors.textPrimary} />
      </Pressable>
      <View className="bg-bgPrimary rounded-b-xl p-3 w-[90%]">
        <View className="border border-borderPrimary gap-1 p-3 rounded-xl">
          <Text className="font-bold text-xl text-textBlack">
            Posição {patientQueueItem?.position || "N/A"}
          </Text>
          <Text className="text-textFourth text-sm">
            Código #{patientQueueItem?.code || null}
          </Text>
          {typeof queue.estimatedWaitMinutes === "number" && (
            <Text className="text-textFourth text-sm">
              Espera estimada:{" "}
              {queue.estimatedWaitMinutes === 0
                ? "Agora"
                : `${queue.estimatedWaitMinutes} min`}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
