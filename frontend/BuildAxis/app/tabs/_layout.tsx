import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import Home from "@/app/tabs/Home/home";
import profile from "@/app/tabs/Profile/profile";
import Site from "@/app/tabs/Sites/Site";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0.5,
          borderTopColor: "#E5E5EA",
          paddingTop: 8,
          paddingBottom: 20,
          height: 80,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

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
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Sites" component={Site} />
      <Tab.Screen name="Profile" component={profile} />
    </Tab.Navigator>
  );
}
