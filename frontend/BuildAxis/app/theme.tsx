// screens/ThemeSelector.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSelector() {
  const { theme, themeMode, changeTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Current Theme: {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => changeTheme("light")}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          Light Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.secondary }]}
        onPress={() => changeTheme("dark")}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          Dark Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.backgroundgrey }]}
        onPress={() => changeTheme("system")}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>
          System Default
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 30 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: { fontWeight: "bold", fontSize: 16 },
});
