import ProjectList from "@/app/raw";
import { Addbuttonspage } from "@/components/ui/addbuttonforpage";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";
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
            {/* <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TaskBox item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
            /> */}
<ProjectList/>
            <Addbuttonspage
                iconname={
                    <FontAwesome6 name="add" size={20} color="white" />
                }
                path={"/addtask"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
