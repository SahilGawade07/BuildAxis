import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="createTask" />
        <Stack.Screen name="taskDetails" />
        <Stack.Screen name="sideanimation" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
