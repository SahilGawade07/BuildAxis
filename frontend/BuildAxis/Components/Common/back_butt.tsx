import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Back_Text_Butt({path,text}:any) {
    return (

        <View style={styles.header}>
            <TouchableOpacity onPress={()=>router.push(path)} >

                <Entypo name="chevron-left" size={30} color="black" />
            </TouchableOpacity >
            <View style={{ width: 6 }} /> {/* Placeholder for spacing */}
            <Text style={styles.headerText}>{text}</Text>

        </View>
    )

}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 10,
        paddingHorizontal: 15,
        alignContent: "center",


    },
    headerText: { color: "#000000ff", fontSize: 25, fontWeight: "bold", }

});