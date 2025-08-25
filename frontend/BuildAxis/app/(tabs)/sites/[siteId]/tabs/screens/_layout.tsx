import React from "react";
import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="addexpenses" />
      <Stack.Screen name="updatematerial" />
      <Stack.Screen 
        name="expense-details" 
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
