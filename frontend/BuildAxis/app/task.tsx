import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { Safe_area } from "@/Components/Common/safeArea";
import { CompanyBar } from "@/Components/reusable";
import AttendancaceBox from "@/Components/Common/attandanceBox";
import Colors from "@/Thems/color";
import Labour_list from "@/Components/Sites/labourScreen";
import ItemTable from "@/Components/Sites/itemScreen";
import MaterialsScreen from "@/Components/Sites/tasks/attachmentScreen"
import ImageScreen from "@/Components/Sites/tasks/ImageScreen";
export default function TaskDetailsScreen() {
    const members = [
        { id: 1, img: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, img: "https://randomuser.me/api/portraits/women/65.jpg" },
        { id: 3, img: "https://randomuser.me/api/portraits/men/85.jpg" },
        { id: 4, img: "https://randomuser.me/api/portraits/women/45.jpg" },
    ];

    const percentage = 40;
    const radius = 25;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const [active, setActive] = useState("Images");
    const [page, setPage] = useState("Assign Task");
    useEffect(() => {
        setPage(active);
    }, [active]);

    const renderPageContent = () => {
        switch (page) {
            case "Images":
                return (
                    <ImageScreen />
                );
            case "Labours":
                return (
                    <Labour_list />
                );
            case "Materials":
                return (
                    <ItemTable />
                );
            case "Attachment":
                return (
                    <MaterialsScreen />
                )

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            {/* Custom Safe Area (if needed) */}
            <Safe_area />

            {/* Company header bar */}
            <CompanyBar />
            <View style={{ backgroundColor: "#fff", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingBottom: 30 }}>
                {/* Task Row */}
                <View style={styles.taskRow}>
                    {/* Back Button + Task Name */}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="arrow-back" size={20} color="black" />
                        <Text style={styles.taskName}>Task Name</Text>
                    </View>

                    {/* User */}
                    <Text style={styles.userName}>Mr.Chemate</Text>
                </View>

                {/* Progress + Members */}
                <View style={styles.progressRow}>
                    {/* Progress Circle */}
                    <View style={styles.progressContainer}>
                        <Svg height="60" width="60">
                            <Circle
                                stroke="#ddd"
                                fill="none"
                                cx="30"
                                cy="30"
                                r={radius}
                                strokeWidth={strokeWidth}
                            />
                            <Circle
                                stroke="#007AFF"
                                fill="none"
                                cx="30"
                                cy="30"
                                r={radius}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </Svg>
                        <View style={styles.progressTextContainer}>
                            <Text style={styles.progressText}>40%</Text>
                        </View>
                    </View>

                    {/* Members */}
                    <View style={styles.memberRow}>
                        {members.map((m) => (
                            <Image key={m.id} source={{ uri: m.img }} style={styles.memberImg} />
                        ))}
                        <TouchableOpacity style={styles.addMember}>
                            <Entypo name="plus" size={20} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.cardContainer}>

                    {/* Present */}
                    <AttendancaceBox
                        backgroundColor={Colors.boxes02[0]}
                        circle_color={Colors.boxes02[1]}
                        Ionicons_name="people-outline"
                        Ionicons_color={Colors.boxes02[2]}
                        Text1="Present"
                        text2="155"
                    />
                    {/* Absent */}
                    <AttendancaceBox
                        backgroundColor={Colors.boxes04[0]}
                        circle_color={Colors.boxes04[1]}
                        Ionicons_name="people-outline"
                        Ionicons_color={Colors.boxes04[2]}
                        Text1="Absent"
                        text2="05"
                    />
                    {/* Half Day */}
                    <AttendancaceBox
                        backgroundColor={Colors.boxes03[0]}
                        circle_color={Colors.boxes03[1]}
                        Ionicons_name="time-outline"
                        Ionicons_color={Colors.boxes03[2]}
                        Text1="Half Day"
                        text2="155"
                    />


                </View>
            </View>
            {/* Tabs */}
            <View style={styles.tabRow}>
                {["Images", "Labours", "Materials", "Attachment"].map((item) => (


                    <TouchableOpacity
                        key={item}
                        onPress={() => setActive(item)}
                        style={styles.menuItem}
                    >
                        <Text style={[styles.text, active === item && styles.activeText1]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView>
                {renderPageContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F4F6FB" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#002B5B",
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    logo: { width: 30, height: 30, marginRight: 10 },
    headerTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
    taskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
    },
    taskName: { fontSize: 15, fontWeight: "600", marginLeft: 5 },
    userName: { fontSize: 14, color: "#555" },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        alignItems: "center",
    },
    progressContainer: { alignItems: "center", justifyContent: "center" },
    progressTextContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    progressText: { fontSize: 12, fontWeight: "600" },
    memberRow: { flexDirection: "row", alignItems: "center" },
    memberImg: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: -10,
        borderWidth: 2,
        borderColor: "#fff",
    },
    addMember: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        marginLeft: 5,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 15,
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 10,
        width: "30%",
    },
    cardText: { fontSize: 12, color: "#333", marginTop: 5 },
    cardCount: { fontSize: 14, fontWeight: "bold", marginTop: 3 },
    tabRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
        padding: 10,
        marginHorizontal: 15,
        borderRadius: 15,
    },
    tab: { paddingBottom: 6 },
    tabText: { fontSize: 14, color: "#888" },
    activeTabText: { color: "#007AFF", fontWeight: "600" },
    sectionTitle: { fontSize: 16, fontWeight: "600", margin: 12 },
    taskImage: {
        width: "90%",
        height: 180,
        borderRadius: 10,
        alignSelf: "center",
        marginBottom: 20,
    },
    cardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
    },
    menuItem: {
        paddingHorizontal: 5,
        paddingVertical: 8,
    },
    text: {
        fontSize: 18,
        color: "black",
    },
    activeText1: {
        color: "#ffffffff",
        textDecorationLine: "underline",
        textDecorationColor: "#ffffffff",
        fontWeight: "500",
        backgroundColor: "#1976D2",
        padding: 5,
        borderRadius: 10
    },
});
