
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

export const FloatingButtons = ({ activepopup ,text}: any) => {
  const { theme } = useTheme();

  return (
          <TouchableOpacity
            style={[styles.floatingButton, { backgroundColor: theme.secondary }]}
            onPress={activepopup} // call the function directly
            activeOpacity={0.8}
          >
            <Text style={styles.floatingButtonText}>{text}</Text>
          </TouchableOpacity>
   
  );
};

const styles = StyleSheet.create({

      floatingButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },


});
