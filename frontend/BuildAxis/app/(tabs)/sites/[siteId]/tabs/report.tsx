import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type ReportItem = {
    id: string;
    title: string;
    name: string;
    dateRange: string;
};

const reports: ReportItem[] = [
    { id: "1", title: "Monthly Progress Report", name: "Shraddha Sawant", dateRange: "01 Jul - 31 Jul" },
    { id: "2", title: "Safety Inspection", name: "Sahil Gawade", dateRange: "05 Jul - 06 Jul" },
    { id: "3", title: "Material Usage Report", name: "Siddharth Chemate", dateRange: "10 Jul - 15 Jul" },
    { id: "4", title: "Expenses Report", name: "Shraddha Sawant", dateRange: "10 Jul - 15 Jul" },
    { id: "5", title: "Inventory Report", name: "Shraddha Sawant", dateRange: "10 Jul - 15 Jul" },
];

export default function ReportScreen() {
    const router = useRouter();

    const renderReportItem = ({ item }: { item: ReportItem }) => (
        <TouchableOpacity style={styles.reportItem} activeOpacity={0.7}>
            <View style={styles.reportContent}>
                <View style={styles.iconContainer}>
                    <Ionicons name="document-text-outline" size={24} color="#4A90E2" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.reportTitle}>{item.title}</Text>
                    <Text style={styles.reportName}>{item.name}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={16} color="#555050ff" />
                    <Text style={styles.dateText}>{item.dateRange}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                renderItem={renderReportItem}
                contentContainerStyle={styles.listContainer}
            />

            {/* Floating Button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => router.push("../CreateReport")}
                activeOpacity={0.8}
            >
                <Text style={styles.floatingButtonText}>Generate Report</Text>
            </TouchableOpacity>

            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100, // space so last item is not hidden behind button
    },
    reportItem: {
        backgroundColor: "#f6f7faff",
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
    },
    reportContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        backgroundColor: "#E6F0FA",
        borderRadius: 8,
        padding: 8,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    reportName: {
        fontSize: 14,
        color: "#777",
        marginTop: 2,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    dateText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 4,
    },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#0247D3",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        elevation: 5, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    floatingButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
