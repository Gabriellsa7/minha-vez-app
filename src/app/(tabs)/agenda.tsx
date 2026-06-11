import { useGetUser } from "@/src/api/get-user-me";
import AgendaContent from "@/src/features/agenda-content/agenda-content";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Agenda() {
  const { data: user } = useGetUser();

  //add a skeleton loading here, install the dependency react-native-skeleton-placeholder
  if (!user) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AgendaContent user={user} />
    </SafeAreaView>
  );
}
