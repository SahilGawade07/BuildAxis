import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // adjust path

export default function Back_Text_Butt({path,text}:any) {
    return (

        <View style={styles.header}>
            <TouchableOpacity onPress={()=>router.back()} >

                <Entypo name="chevron-left" size={30} color="black" />
            </TouchableOpacity >
            <View style={{ width: 6 }} /> {/* Placeholder for spacing */}
            <Text style={styles.headerText}>{text}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
