import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Calendar, House, Search, User } from "lucide-react-native";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0F766E",
        tabBarInactiveTintColor: "#64748B",

        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 12,
        },

        tabBarLabelStyle: {
          fontSize: 12,
        },

        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          height: 80,
          marginHorizontal: 12,

          borderRadius: 40,
          overflow: "hidden",
          backgroundColor: "transparent",
          borderTopWidth: 0,

          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },

          elevation: 10,
        },

        tabBarBackground: () => (
          <BlurView intensity={40} tint="light" style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            />
          </BlurView>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
