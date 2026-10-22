import { useThemeColors } from "@/src/hooks/use-theme-colors";
import { NotificationService } from "@/src/services/notifications/notification.service";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { restoreSession } from "@/src/services/auth/auth.session";

export default function Index() {
  const colors = useThemeColors();
  const [destination, setDestination] = useState<"/home" | "/login" | null>(
    null,
  );

  useEffect(() => {
    void restoreSession().then((isSignedIn) => {
      setDestination(isSignedIn ? "/home" : "/login");
      if (isSignedIn) void NotificationService.registerForPushNotifications();
    });
  }, []);

  if (!destination) {
    return (
      <View className="flex-1 items-center justify-center bg-bgPrimary">
        <ActivityIndicator color={colors.tabActive} />
      </View>
    );
  }

  return <Redirect href={destination} />;
}
