import { IHealthUnit } from "@/src/config/entities/health-unit/health-unit.types";
import { Image } from "expo-image";
import { router } from "expo-router";
import { MapPin, Timer, Users } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { getMockClinicStats } from "../utils/mock-clinic-stats";

interface ClinicsSectionProps {
  healthUnits?: IHealthUnit[];
  isLoading?: boolean;
}

export function ClinicsSection({ healthUnits, isLoading }: ClinicsSectionProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-textBlack">
            Clínicas Próximas
          </Text>
          <Text className="text-sm text-textFourth">
            Unidades disponíveis para atendimento
          </Text>
        </View>
        <Pressable onPress={() => router.push("/health-units")}>
          <Text className="text-sm font-medium text-textSecondary">
            Ver todas
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
          <Text className="text-sm text-textFourth">
            Carregando clínicas...
          </Text>
        </View>
      ) : !healthUnits || healthUnits.length === 0 ? (
        <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
          <Text className="text-sm text-textFourth">
            Nenhuma clínica encontrada.
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 14 }}
        >
          {healthUnits.map((unit) => {
            const stats = getMockClinicStats(unit._id);

            return (
              <Pressable
                key={unit._id}
                onPress={() => router.push(`/health-unit-info/${unit._id}`)}
                className="w-64 rounded-2xl border border-[#E7ECEF] bg-bgThird"
              >
                <View className="h-32 w-full overflow-hidden rounded-t-2xl bg-[#E2E8F0]">
                  {unit.img ? (
                    <Image
                      source={{ uri: unit.img }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  ) : (
                    <Image
                      source={require("../../../../assets/images/Hospital.png")}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  )}
                </View>
                <View className="gap-2 p-3">
                  <Text
                    className="text-base font-bold text-textBlack"
                    numberOfLines={1}
                  >
                    {unit.name}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <MapPin size={12} color="#A8A8A8" />
                    <Text className="text-xs text-textFourth" numberOfLines={1}>
                      {unit.address.street}, {unit.address.number}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between rounded-xl bg-[#F4FBFC] px-3 py-2">
                    <View className="flex-row items-center gap-1">
                      <Timer size={14} color="#006673" />
                      <Text className="text-xs text-textSecondary">
                        <Text className="font-bold">{stats.waitMinutes} min</Text>{" "}
                        espera
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Users size={14} color="#006673" />
                      <Text className="text-xs text-textSecondary">
                        <Text className="font-bold">{stats.activeQueueSize}</Text>{" "}
                        na fila
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
