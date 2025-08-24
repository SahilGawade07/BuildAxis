import { Stack } from "expo-router";

export default function ExpenseDetailsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[expenseId]" />
    </Stack>
  );
}
