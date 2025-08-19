import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.listItemFill,
          // borderTopWidth: 1,
          // borderTopColor: theme.listItemBorder,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 35 : 20,
          height: Platform.OS === "ios" ? 95 : 75,
          marginBottom: 10,
        },
        tabBarActiveTintColor: theme.activeTabIcon,
        tabBarInactiveTintColor: theme.icons,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "400",
          marginTop: 4,
          color: theme.text,
        },
        tabBarIconStyle: { marginBottom: 2 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sites"
        options={{
          title: "Sites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "location" : "location-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
