import React from "react";
import { View, Text, StyleSheet, Platform, Pressable } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

export default function ThemeSelector() {
  const { theme, themeMode, changeTheme } = useTheme();

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="color-palette-outline"
          size={28}
          color={theme.primary}
        />
        <Text style={[styles.title, { color: theme.text }]}>Choose Theme</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Current:{" "}
          <Text style={{ fontWeight: "600" }}>{capitalize(themeMode)}</Text>
        </Text>
      </View>

      {/* Theme Options */}
      <View style={styles.optionsContainer}>
        {/* Light Mode */}
        <Pressable
          style={({ pressed }) => [
            styles.optionButton,
            {
              backgroundColor:
                themeMode === "light"
                  ? theme.primary + "20"
                  : theme.listItemFill,
              borderColor:
                themeMode === "light" ? theme.primary : theme.listItemBorder,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => changeTheme("light")}
        >
          <View style={styles.optionContent}>
            <View
              style={[styles.iconBox, { backgroundColor: theme.boxes01[0] }]}
            >
              <Ionicons name="sunny-outline" size={20} color="#FFD700" />{" "}
              {/* Gold sun */}
            </View>
            <Text style={[styles.optionText, { color: theme.text }]}>
              Light Mode
            </Text>
          </View>
          {themeMode === "light" && (
            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
          )}
        </Pressable>

        {/* Dark Mode */}
        <Pressable
          style={({ pressed }) => [
            styles.optionButton,
            {
              backgroundColor:
                themeMode === "dark"
                  ? theme.primary + "20"
                  : theme.listItemFill,
              borderColor:
                themeMode === "dark" ? theme.primary : theme.listItemBorder,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => changeTheme("dark")}
        >
          <View style={styles.optionContent}>
            <View
              style={[styles.iconBox, { backgroundColor: theme.boxes01[0] }]}
            >
              <Ionicons name="moon-outline" size={20} color="#8A2BE2" />{" "}
              {/* Purple moon */}
            </View>
            <Text style={[styles.optionText, { color: theme.text }]}>
              Dark Mode
            </Text>
          </View>
          {themeMode === "dark" && (
            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
          )}
        </Pressable>

        {/* System Mode */}
        <Pressable
          style={({ pressed }) => [
            styles.optionButton,
            {
              backgroundColor:
                themeMode === "system"
                  ? theme.primary + "20"
                  : theme.listItemFill,
              borderColor:
                themeMode === "system" ? theme.primary : theme.listItemBorder,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => changeTheme("system")}
        >
          <View style={styles.optionContent}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: theme.backgroundgrey },
              ]}
            >
              <Ionicons name="desktop-outline" size={20} color={theme.icons} />
            </View>
            <Text style={[styles.optionText, { color: theme.text }]}>
              System Default
            </Text>
          </View>
          {themeMode === "system" && (
            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
          )}
        </Pressable>
      </View>

      {/* Tip */}
      <Text style={[styles.tipText, { color: theme.text }]}>
        Theme applies across the entire app.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
  optionsContainer: {
    width: "100%",
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tipText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 24,
    opacity: 0.8,
  },
});
