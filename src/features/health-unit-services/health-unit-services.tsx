import { useGetHealthUnitById } from "@/src/api/get-health-unit-by-id";
import { getServiceIcon } from "@/src/utils/service-icon.util";
import { MapPin, Stethoscope } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

interface HealthUnitServicesProps {
  healthUnitId: string;
}

export function HealthUnitServices({ healthUnitId }: HealthUnitServicesProps) {
  const { data: healthUnit, isLoading } = useGetHealthUnitById({
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
          Todos os serviços
        </Text>

        {isLoading ? (
          <View className="rounded-2xl border border-dashed border-[#D7EEF2] bg-white p-4">
            <Text className="text-sm text-textFourth">
              Carregando serviços...
            </Text>
          </View>
        ) : !healthUnit?.services || healthUnit.services.length === 0 ? (
          <View className="items-center justify-center rounded-2xl bg-bgThird p-8">
            <Stethoscope size={28} color="#0F766E" />
            <Text className="mt-3 text-center text-textFifth">
              Esta clínica ainda não cadastrou serviços oferecidos.
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {healthUnit.services.map((service) => {
              const ServiceIcon = getServiceIcon(service.name);

              return (
                <View
                  className="bg-bgThird rounded-2xl p-5 gap-4 border border-[#E7ECEF]"
                  key={service._id}
                >
                  <View className="flex-row gap-4 items-start">
                    <View className="bg-[#DDF4F7] p-3 rounded-xl">
                      <ServiceIcon size={24} color="#0B7A87" />
                    </View>

                    <View className="flex-1 gap-1">
                      <Text className="font-bold text-lg text-textBlack">
                        {service.name}
                      </Text>

                      {service.description ? (
                        <Text className="text-textFifth leading-5">
                          {service.description}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
