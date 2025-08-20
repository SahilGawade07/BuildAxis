import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function LabourList({ item }: any) {
  const { theme } = useTheme(); // ✅ use theme

  return (
    <View>
      <View
        style={[
          styles.row,
          { backgroundColor: theme.listItemFill }, // row background adapts
        ]}
      >
        <View
          style={[
            styles.imageBox,
            { backgroundColor: theme.boxes01[0] }, // themed color for avatar
          ]}
        >
          <Ionicons name="image-outline" size={28} color={theme.icons} />
        </View>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
      </View>
      <View
        style={[
          styles.separator,
          { backgroundColor: theme.listItemBorder }, // separator adapts
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
  },
  imageBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
