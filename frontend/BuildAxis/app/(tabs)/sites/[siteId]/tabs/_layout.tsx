import React from "react";
import { Stack } from "expo-router";

export default function SiteTabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="report" />
      <Stack.Screen name="labourScreen" />
      <Stack.Screen name="labourDetails" />
      <Stack.Screen name="itemScreen" />
      <Stack.Screen name="expencessScreen" />
      <Stack.Screen name="attandanceScreen" />
      <Stack.Screen name="InventoryScreen" />
    </Stack>
  );
}
