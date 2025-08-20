import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Upload_img({ path, text }: any) {
  return (
    <>
      <Text style={styles.label}>{text}</Text>
      <TouchableOpacity style={styles.uploadBox}>
        <AntDesign name="plus" size={32} color="#3D7BF7" />
      </TouchableOpacity></>
  )

}


const styles = StyleSheet.create({

  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
    marginTop: 16,
    fontWeight: "600"
  },
    uploadBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

});