import React from "react";
import { Stack } from "expo-router";

export default function SiteDetailsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* /sites/[siteId] */}
      <Stack.Screen name="edit" /> {/* /sites/[siteId]/edit */}
      <Stack.Screen name="reports" /> {/* /sites/[siteId]/reports */}
    </Stack>
  );
}
