import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function Topbar({text, funs}:any) {

  const router = useRouter();


    return (

        <>
            <View style={styles.header}>
                <Text style={styles.headerText}>{text}</Text>
                <TouchableOpacity onPress={funs}>
                    <Text style={styles.close}>✕</Text>
                </TouchableOpacity>
                
            </View>
        </>



    );
}

const styles = StyleSheet.create({

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    close: {
        fontSize: 16,
        color: "#555",
    },
  
});
