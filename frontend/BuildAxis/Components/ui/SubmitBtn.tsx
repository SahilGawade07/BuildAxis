import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Submit_bbutt({ path, text, funcations }: any) {
  return (

    <TouchableOpacity style={styles.assignBtn} onPress={funcations}>
      <Text style={styles.assignBtnText}>{text}</Text>
    </TouchableOpacity>

  )

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

});