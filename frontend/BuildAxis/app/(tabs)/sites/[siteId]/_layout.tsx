import React from "react";
import { Stack } from "expo-router";

export default function SiteDetailsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* /sites/[siteId] */}
      <Stack.Screen name="taskDetails" /> {/* /sites/[siteId]/taskDetails */}
      <Stack.Screen name="CreateReport" /> {/* /sites/[siteId]/CreateReport */}
      <Stack.Screen name="tabs" /> {/* /sites/[siteId]/tabs */}
    </Stack>
  );
}
