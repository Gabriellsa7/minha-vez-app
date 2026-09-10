import { View, Text } from "react-native";
import { Clock, AlertTriangle } from "lucide-react-native";
import { getVisitUrgency, VisitUrgency } from "@/src/utils/visit-urgency";

export { getVisitUrgency, VisitUrgency };

export function UrgencyBadge({ urgency }: { urgency: VisitUrgency }) {
  if (!urgency || urgency.stage === "checkin") return null;

  const isUrgent = urgency.stage === "hour";

  return (
    <View
      className={`flex-row items-center gap-1.5 self-start rounded-full py-1 pl-1 pr-2.5 ${
        isUrgent ? "bg-statusDangerBg" : "bg-warningBg"
      }`}
    >
      <View
        className={`items-center justify-center rounded-full p-1 ${
          isUrgent ? "bg-statusDangerText" : "bg-warningText"
        }`}
      >
        <Clock size={10} color="#fff" />
      </View>
      <Text
        className={`text-[10px] font-bold uppercase tracking-wide ${
          isUrgent ? "text-statusDangerText" : "text-warningText"
        }`}
      >
        {urgency.stage === "day" ? urgency.label : urgency.countdownLabel}
      </Text>
    </View>
  );
}

export function CheckInUrgencyBanner({ urgency }: { urgency: VisitUrgency }) {
  if (!urgency || urgency.stage !== "checkin") return null;

  return (
    <View className="mt-3 flex-row items-center gap-2 rounded-xl bg-statusDangerText px-3 py-2">
      <AlertTriangle size={14} color="#fff" />
      <Text className="flex-1 text-xs font-bold text-white">
        Faça check-in agora · {urgency.countdownLabel}
      </Text>
    </View>
  );
}
