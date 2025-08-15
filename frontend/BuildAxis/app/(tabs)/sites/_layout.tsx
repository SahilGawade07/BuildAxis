import React from "react";
import { Stack } from "expo-router";

export default function SitesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[siteId]" options={{ title: "Site Info" }} />
      <Stack.Screen name="addSite" options={{ title: "Add Site" }} />
    </Stack>
  );
}
