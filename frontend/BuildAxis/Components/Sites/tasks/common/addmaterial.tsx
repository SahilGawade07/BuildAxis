import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTheme } from "../../../../context/ThemeContext"; 

export default function AddMaterial({ text, text2, funcations }: any) {
  const { theme } = useTheme(); // ✅ get active theme

  return (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: theme.text }]}>{text}</Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.boxes01[0] }]}
        onPress={funcations}
      >
        <FontAwesome6 name="plus" size={16} color={theme.primary} />
        <Text style={[styles.addButtonText, { color: theme.primary }]}>
          {text2}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderRadius: 12,
  },
  rowText: {
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
});
