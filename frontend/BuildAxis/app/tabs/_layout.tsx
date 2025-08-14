import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabNavigator() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0.5,
          borderTopColor: "#E5E5EA",
          paddingTop: 8,
          paddingBottom: 20,
          height: 80,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName:any;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Sites":
              iconName = "location-outline";
              break;
            case "Profile":
              iconName = "person-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return (
            <Ionicons name={iconName} size={focused ? 26 : 24} color={color} />
          );
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "400",
          marginTop: 4,
        },
      })}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Sites" />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
}
