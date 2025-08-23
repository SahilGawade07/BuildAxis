import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Upload_img({ path, text }: any) {
  return (
    <>
          <Text style={styles.label}>{text}</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="add" size={28} color="#007bff" />
          </TouchableOpacity>
          </>
  )

}


const styles = StyleSheet.create({

    label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    marginBottom: 6,
  },
    uploadBox: {
    height: 100,
    width: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbb",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});