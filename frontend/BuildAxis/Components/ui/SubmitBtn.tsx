import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Submit_bbutt({
  path,
  text,
  funcations,
  onPress,
  disabled = false,
}: any) {
  const handlePress = onPress || funcations;

  return (
    <TouchableOpacity
      style={[styles.assignBtn, disabled && styles.disabledBtn]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={[styles.assignBtnText, disabled && styles.disabledText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  assignBtn: {
    backgroundColor: "#0A58FF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    // marginTop: 25,
    // marginBottom: 30,
    marginTop: 15,
  },
  assignBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  disabledBtn: {
    backgroundColor: "#ccc",
  },
  disabledText: {
    color: "#666",
  },
});
