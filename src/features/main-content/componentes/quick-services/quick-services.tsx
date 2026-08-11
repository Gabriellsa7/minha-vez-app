import { router } from "expo-router";
import { Calendar, Compass, FileText, History } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function QuickServices() {
  return (
    <View className="gap-5">
      <Text>Serviços Rapidos</Text>
      <View className="flex-row flex-wrap">
        <View className="w-1/3 items-center gap-4">
          <Pressable onPress={() => router.push("/agenda")}>
            <View className="rounded-lg p-6 bg-bgThird">
              <Calendar size={20} color="#008493" />
            </View>
          </Pressable>
          <Text>Agendar</Text>
        </View>
        <View className="w-1/3 items-center gap-4">
          <Pressable onPress={() => router.push("/history")}>
            <View className="rounded-lg p-6 bg-bgThird">
              <History size={20} color="#008493" />
            </View>
          </Pressable>
          <Text>Histórico</Text>
        </View>
        <View className="w-1/3 items-center gap-4">
          <Pressable onPress={() => router.push("/explore")}>
            <View className="rounded-lg p-6 bg-bgThird">
              <Compass size={20} color="#008493" />
            </View>
          </Pressable>
          <Text>Explorar</Text>
        </View>
        <View className="w-1/3 items-center gap-4">
          <Pressable onPress={() => router.push("/exams")}>
            <View className="rounded-lg p-6 bg-bgThird">
              <FileText size={20} color="#008493" />
            </View>
          </Pressable>
          <Text>Meus Exames</Text>
        </View>
      </View>
    </View>
  );
}
