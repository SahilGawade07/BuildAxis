import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Add_items({path,text}:any) {
    return (

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>{text}</Text>
          <AntDesign name="plus" size={20} color="#3D7BF7" />
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  rowText: {
    fontSize: 16,
    color: '#333',

    fontWeight: "600"
  },

});