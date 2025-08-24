import React from "react";
import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="addexpenses" />
      <Stack.Screen name="updatematerial" />
    </Stack>
  );
}
