import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";
import Topbar from "@/Components/Sites/popupScreens/common/topBar"
export default function AttendanceModal({fun}:any) {
    const [attendance, setAttendance] = useState([false, false, false, false, false]);

    const data = [
        { id: "1", name: "Shraddha Swant" },
        { id: "2", name: "Shraddha Swant" },
        { id: "3", name: "Shraddha Swant" },
        { id: "4", name: "Shraddha Swant" },
        { id: "5", name: "Shraddha Swant" },
        { id: "1", name: "Shraddha Swant" },
        { id: "2", name: "Shraddha Swant" },
        { id: "3", name: "Shraddha Swant" },
        { id: "4", name: "Shraddha Swant" },
        { id: "5", name: "Shraddha Swant" },

    ];

    const toggleAttendance = (index: number) => {
        const updated = [...attendance];
        updated[index] = !updated[index];
        setAttendance(updated);
    };

    return (
        <View style={styles.modal}>
            {/* Header */}
            <Topbar text="Mark Attendance" funs={fun}/>  
                                            
            {/* List */}
            <FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()} // fixed duplicate key issue
                renderItem={({ item, index }) => {
                    const isChecked = attendance[index];
                    return (
                        <TouchableOpacity
                            style={[styles.row, isChecked && styles.checkedRow]}
                            onPress={() => toggleAttendance(index)}
                        >
                            <Image
                                source={{ uri: "https://via.placeholder.com/30" }}
                                style={styles.avatar}
                            />
                            <Text style={styles.name}>{item.name}</Text>
                            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                                {isChecked && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                        </TouchableOpacity>
                    );
                }}
                style={{ maxHeight: 500 }} // limit height so it scrolls
                showsVerticalScrollIndicator={true} // show scrollbar
            />

            {/* Button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Update Attendance</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        width: "95%",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,




    },
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
    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        borderRadius: 6,
        padding: 8,
        marginBottom: 6,
    },
    checkedRow: {
        backgroundColor: "#e0f7e9",
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 4,
        backgroundColor: "#ddd",
        marginRight: 10,
    },
    name: {
        flex: 1,
        fontSize: 14,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    checkmark: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    button: {
        backgroundColor: "#0066ff",
        paddingVertical: 10,
        borderRadius: 6,
        marginTop: 10,
    },
    buttonText: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
    },
});
