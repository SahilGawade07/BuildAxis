import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // adjust path

export default function Back_Text_Butt({ path, text }: any) {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push(path)}>
        <Entypo name="chevron-left" size={30} color={theme.text} />
      </TouchableOpacity>
      <View style={{ width: 6 }} />
      <Text style={[styles.headerText, { color: theme.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
