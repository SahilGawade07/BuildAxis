import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="createTask" />
          <Stack.Screen name="taskDetails" />
          <Stack.Screen name="sideanimation" />
          <Stack.Screen name="raw" />
          <Stack.Screen name="boxex" />
          <Stack.Screen name="tp" />

          <Stack.Screen name="labourui" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>

  );
}
