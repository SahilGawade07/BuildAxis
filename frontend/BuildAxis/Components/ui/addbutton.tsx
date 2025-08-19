
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

export const Addbuttons = ({ iconname }: any) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme.secondary }]}
    // onPress={() => router.push("/sites/addSite")}
    >
      {iconname}   {/* render the passed icon here */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    right: 20,
    bottom: 90,
    alignItems: "center",
    justifyContent: "center",
  },

});
