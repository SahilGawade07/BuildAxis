import React from 'react'; 
import { Stack } from "expo-router";

export default function RootLayout() {
  const checks = false;
  // const initialRoute = checks ? "Screens/login" : "tabs";

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName={"tabs"}>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
