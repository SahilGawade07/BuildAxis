// app/(tabs)/profile/_layout.tsx
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="themeSettings" />
      <Stack.Screen name="manageOrganisation" />
      <Stack.Screen name="changePassword" />
    </Stack>
  );
}
