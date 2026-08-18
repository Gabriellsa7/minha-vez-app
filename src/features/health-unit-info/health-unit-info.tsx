import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { useGetHealthUnitRatingSummary } from "@/src/api/get-health-unit-rating-summary";
import { EHealthUnitType } from "@/src/config/entities/health-unit/health-unit.types";
import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { getServiceIcon } from "@/src/utils/service-icon.util";
import { isToday, weekDayLabel } from "@/src/utils/util";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Stethoscope,
  TestTube,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function HealthUnitInfo() {
  const { id } = useLocalSearchParams();
  const colors = useThemeColors();

  const { data: healthUnit } = useGetHealthUnitById({
    healthUnitId: id as string,
  });

  const { data: rating } = useGetHealthUnitRatingSummary({
    healthUnitId: id as string,
  });
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="p-4 gap-6">
        <View>
          <View className=" h-64 w-full overflow-hidden rounded-xl bg-bgThird border-solid border-[6px] border-bgFourth">
            {healthUnit?.img ? (
              <Image
                source={{ uri: healthUnit.img }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <Image
                source={require("../../../assets/images/Hospital.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            )}
          </View>
        </View>
        <View className="bg-bgThird gap-4 p-4 rounded-xl">
          <View className="gap-1">
            <Text className="text-3xl font-bold text-textBlack">
              {healthUnit?.name}
            </Text>
            {healthUnit && (
              <View
                className={`self-start px-3 py-1 rounded-full ${
                  healthUnit.unitType === EHealthUnitType.PRIVATE
                    ? "bg-warningBg"
                    : "bg-infoBg"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    healthUnit.unitType === EHealthUnitType.PRIVATE
                      ? "text-warningText"
                      : "text-highlightText"
                  }`}
                >
                  {healthUnit.unitType === EHealthUnitType.PRIVATE
                    ? "Unidade Privada"
                    : "Unidade Pública"}
                </Text>
              </View>
            )}
            {rating && rating.count > 0 && (
              <View className="flex-row items-center gap-1">
                <Star size={16} color={colors.accentStar} fill={colors.accentStar} />
                <Text className="text-sm font-semibold text-textBlack">
                  {rating.average?.toFixed(1)}
                </Text>
                <Text className="text-sm text-textFifth">
                  ({rating.count} avaliaç{rating.count > 1 ? "ões" : "ão"})
                </Text>
              </View>
            )}
            <Text className="leading-6 text-textFifth">
              {healthUnit?.description}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="bg-infoBg p-2 rounded-xl">
              <MapPin size={20} color={colors.textSecondary} />
            </View>

            <View className="flex-1">
              <Text className="text-textBlack text-xl font-medium">
                Endereço
              </Text>

              <Text className="text-textFifth mt-1 leading-5">
                {healthUnit?.address.street}, {healthUnit?.address.number} -{" "}
                {healthUnit?.address.neighborhood}
                {healthUnit?.address.city} - {healthUnit?.address.state}
              </Text>
            </View>
          </View>
          <View className="flex gap-2">
            <View className="flex-row items-center gap-2">
              <View className="bg-infoBg p-2 rounded-xl">
                <Clock size={22} color={colors.textSecondary} />
              </View>
              <Text className="text-textBlack text-xl font-medium">
                Horários de funcionamento
              </Text>
            </View>
            <View className="gap-2">
              {healthUnit?.openingHours.map((openingHour) => (
                <View
                  key={openingHour.day}
                  className={`flex-row items-center justify-between rounded-2xl px-4 py-4 border ${
                    isToday(openingHour.day)
                      ? "bg-highlightBg border-highlightBorder"
                      : "bg-bgPrimary border-borderPrimary"
                  }`}
                >
                  <View>
                    <Text className="font-semibold text-base text-textBlack">
                      {weekDayLabel[openingHour.day]}
                    </Text>

                    {isToday(openingHour.day) && (
                      <Text className="text-xs text-highlightText font-medium">
                        Hoje
                      </Text>
                    )}
                  </View>
                  {openingHour.isClosed ? (
                    <View className="bg-statusDangerBg px-3 py-1 rounded-full">
                      <Text className="text-statusDangerText font-semibold text-xs">
                        Fechado
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-infoBg px-3 py-2 rounded-full">
                      <Text className="font-bold text-highlightText">
                        {openingHour.open} - {openingHour.close}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View className="bg-infoBg border border-infoBorder rounded-2xl p-5 gap-3">
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-3xl bg-highlightBorder" />
            <Text className="text-highlightText font-bold tracking-widest uppercase text-sm">
              Status da Fila
            </Text>
          </View>

          <Text className="text-base text-textBlack">
            Tempo médio de espera:{" "}
            <Text className="font-bold text-highlightText">15 min</Text>
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-textBlack">Serviços Oferecidos</Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/health-unit-services/[id]",
                params: { id: healthUnit?._id ?? "" },
              })
            }
          >
            <Text className="text-textSecondary font-medium">Ver todos</Text>
          </Pressable>
        </View>
        <View className="gap-4">
          {healthUnit?.services.map((health) => {
            const ServiceIcon = getServiceIcon(health.name);

            return (
              <View
                className="bg-bgThird rounded-2xl p-5 gap-4 border border-borderPrimary"
                key={health._id}
              >
                <View className="flex-row gap-4 items-start">
                  <View className="bg-infoBg p-3 rounded-xl">
                    <ServiceIcon size={24} color={colors.highlightText} />
                  </View>

                  <View className="flex-1 gap-1">
                    <Text className="font-bold text-lg text-textBlack">
                      {health.name}
                    </Text>

                    <Text className="text-textFifth leading-5">
                      {health.description}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <View className="gap-3">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/agenda",
                params: { unitId: healthUnit?._id },
              })
            }
            className="rounded-[20px] bg-bgSecondary p-4"
          >
            <View className="flex-row items-center justify-center gap-2">
              <CalendarDays size={18} color={colors.textPrimary} />
              <Text className="text-base font-semibold text-textPrimary">
                Marcar Consulta
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/health-unit-schedule/[id]",
                params: { id: healthUnit?._id ?? "" },
              })
            }
            className="rounded-[20px] border border-bgSecondary bg-bgThird p-4"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Stethoscope size={18} color={colors.textSecondary} />
              <Text className="text-base font-semibold text-textSecondary">
                Agendar por Especialidade
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() =>
              router.push(`/exam-scheduling/${healthUnit?._id ?? ""}`)
            }
            className="rounded-[20px] border border-bgSecondary bg-bgThird p-4"
          >
            <View className="flex-row items-center justify-center gap-2">
              <TestTube size={18} color={colors.textSecondary} />
              <Text className="text-base font-semibold text-textSecondary">
                Agendar Exame
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
