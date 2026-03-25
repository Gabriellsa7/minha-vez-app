import { Tabs } from "expo-router";
import { House } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8162FF",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarStyle: {
          display: "flex",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: "#141518",
          borderTopColor: "#4b5563",
          borderTopWidth: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
