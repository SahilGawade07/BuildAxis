import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // adjust path

export default function Back_Text_Butt({path,text}:any) {
    const { theme } = useTheme();
  
    return (

        <View style={[styles.header,{backgroundColor: theme.primary}]}>
            <TouchableOpacity onPress={()=>router.back()} >

                <Entypo name="chevron-left" size={30} color="white" />
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
    
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    color:"white"
  },
});
