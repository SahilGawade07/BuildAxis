
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { router } from "expo-router";
import { useRouter } from "expo-router";

export const Addbuttonspage = ({ iconname ,path }: any) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme.secondary }]}
    onPress={()=>{router.push("/sideanimation")}}
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
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },

});
