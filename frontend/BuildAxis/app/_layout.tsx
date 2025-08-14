import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  const checks = false;
  // const initialRoute = checks ? "Screens/login" : "tabs";

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={"tabs"}>
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
