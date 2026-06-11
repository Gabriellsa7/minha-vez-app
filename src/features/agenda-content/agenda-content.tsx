import Header from "@/src/components/header/header";
import { IUser } from "@/src/config/entities/user/user.types";
import { View } from "react-native";

interface AgendaContentProps {
  user: IUser;
}

export default function AgendaContent({ user }: AgendaContentProps) {
  return (
    <View>
      <Header text="Agendar" user={user} />
    </View>
  );
}
