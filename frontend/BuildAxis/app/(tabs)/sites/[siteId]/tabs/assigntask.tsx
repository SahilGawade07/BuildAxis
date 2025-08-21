import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";
import { TaskBox } from "@/components/Sites/taskBox";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Addbuttons } from "@/components/ui/addbutton";

export const Assigntask = () => {
    const { theme } = useTheme(); // ✅ get theme
    const projects = [
        { id: "1", name: "JJ Hormony", progress: "20%", status: "Active", date: "08-08-2006" },
        { id: "2", name: "Green Heights", progress: "45%", status: "Active", date: "08-08-2006" },
        { id: "3", name: "JJ Hormony", progress: "20%", status: "Active", date: "08-08-2006" },
        { id: "4", name: "Green Heights", progress: "45%", status: "Active", date: "08-08-2006" },
        { id: "5", name: "JJ Hormony", progress: "20%", status: "Active", date: "08-08-2006" },
        { id: "6", name: "Green Heights", progress: "45%", status: "Active", date: "08-08-2006" },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TaskBox item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
            />

            <Addbuttons
                iconname={
<MaterialIcons name="add" size={34} color="#fff" />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
