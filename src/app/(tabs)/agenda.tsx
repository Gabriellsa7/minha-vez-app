import { useGetUser } from "@/src/api/get-user-me";
import { AgendaSkeleton } from "@/src/components/skeletons/agenda-skeleton";
import AgendaContent from "@/src/features/agenda-content/agenda-content";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Agenda() {
  const { data: user } = useGetUser();

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AgendaSkeleton />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AgendaContent user={user} />
    </SafeAreaView>
  );
}
