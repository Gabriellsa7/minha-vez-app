import { useGetUser } from "@/src/api/get-user-me";
import { ArrowRight, Bell, Info, Smile, User } from "lucide-react-native";
import { Text, View } from "react-native";

export default function Home() {
  const { data: user } = useGetUser();

  return (
    <View className="items-center justify-center">
      <View className="w-full bg-gradient-to-b from-[#006579] to-[#008096] gap-3 p-5">
        <View className="flex-row items-center justify-between pb-2">
          <View className="gap-3 flex-row items-center">
            {/* User Profile Image */}
            <User size={32} color="#FFFFFF" />
            <View>
              <Text className="text-textPrimary font-bold text-xl">
                Bom dia, {user?.name || "User"}
              </Text>
              <Text className="text-textThird">Permita-nós ajuda-lo</Text>
            </View>
          </View>
          <View className="gap-3 flex-row">
            <View className="rounded-full bg-bgSecondary p-2">
              <Bell size={24} color="#FFFFFF" />
            </View>
            <View className="rounded-full bg-bgSecondary p-2">
              <Info size={24} color="#FFFFFF" />
            </View>
          </View>
        </View>
        <View className="gap-2">
          <Text className="text-textThird text-sm">Filas Ativas</Text>
          <View>
            <View className="w-full flex-row items-center justify-between bg-[#0092AA] p-3 rounded-t-xl">
              <View className="flex-row items-center gap-2">
                <View className="rounded-full bg-bgSecondary p-2">
                  {/* Clinic Image */}
                  <Smile color="#FFFFFF" size={24} />
                </View>
                <View className="gap-1">
                  <Text className="text-textPrimary">
                    Fila da Clinica Ortopedica
                  </Text>
                  <Text className="text-textPrimary text-sm opacity-50">
                    Atual Fila 5 de 20
                  </Text>
                </View>
              </View>
              <ArrowRight size={28} color="#FFFFFF" />
            </View>
            <View className="bg-bgPrimary rounded-b-xl p-3">
              <View className="border border-[#D8D8D8] gap-1 p-3 rounded-xl">
                <Text className="font-bold text-xl">Posição 6</Text>
                <Text className="text-textFourth text-sm">
                  Sua vez 11:12 #YU78
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
