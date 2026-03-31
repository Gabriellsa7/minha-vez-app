import { Calendar, Compass, FileText, History } from "lucide-react-native";
import { Text, View } from "react-native";

export function QuickServices() {
  return (
    <View className="gap-5">
      <Text>Serviços Rapidos</Text>
      <View className="flex-row justify-between">
        <View className="items-center gap-4">
          <View className="rounded-lg p-6 bg-[#F4F4F4]">
            <Calendar size={20} color="#008493" />
          </View>
          <Text>Agendar</Text>
        </View>
        <View className="items-center gap-4">
          <View className="rounded-lg p-6 bg-[#F4F4F4]">
            <History size={20} color="#008493" />
          </View>
          <Text>Histórico</Text>
        </View>
        <View className="items-center gap-4">
          <View className="rounded-lg p-6 bg-[#F4F4F4]">
            <Compass size={20} color="#008493" />
          </View>
          <Text>Explorar</Text>
        </View>
        <View className="items-center gap-4">
          <View className="rounded-lg p-6 bg-[#F4F4F4]">
            <FileText size={20} color="#008493" />
          </View>
          <Text>Exames</Text>
        </View>
      </View>
    </View>
  );
}
