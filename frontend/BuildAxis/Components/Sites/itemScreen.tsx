import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Itemrow } from "@/Components/Common/itemlistrow"
import { FontAwesome6 } from "@expo/vector-icons";
export default function ItemTable() {
    const data = [
        { id: "1", name: "Bricks", qty: "10000 ps" },
        { id: "2", name: "Bricks", qty: "10000 ps" },
        { id: "3", name: "Bricks", qty: "10000 ps" },
    ];



    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerText, { flex: 3 }]}>Item Name</Text>
                <Text style={[styles.headerText, { flex: 1, textAlign: "right" }]}>
                    Qty
                </Text>
            </View>

            <View style={styles.divider} />

            {/* List */}
            <FlatList
                data={data}
                renderItem={Itemrow}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 0.5, backgroundColor: "#ddd" }} />
                )}/>

    <TouchableOpacity
                style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    backgroundColor: "#0247D3",
                    position: "absolute",
                    right: 20,
                    bottom: 40,
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPress={() => { }}
            >
                <FontAwesome6 name="add" size={20} color="white" />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        height:"60%",
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        marginBottom: 4,
    },
    headerText: {
        fontWeight: "600",
        fontSize: 13,
        color: "gray",
    },
    divider: {
        height: 1,
        backgroundColor: "#ccc",
        marginBottom: 6,
    },

});
