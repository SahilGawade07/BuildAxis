import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusing Task_Box styles (assuming it's in a reusable file or copied here)
import { Task_Box} from "@/Components/Sites/task_box"; // Adjust path as needed

// Dummy data for reports (mimicking the screenshot)
const reports = [
  {
    id: "1",
    name: "Expense Report",
    subName: "Shraddha Swant",
    date: "12/09/2025 to 18/09/2026",
    status: "Active",
    progress: "Completed",
  },
  {
    id: "2",
    name: "Expense Report",
    subName: "Shraddha Swant",
    date: "12/09/2025 to 18/09/2026",
    status: "Active",
    progress: "Completed",
  },
  {
    id: "3",
    name: "Expense Report",
    subName: "Shraddha Swant",
    date: "12/09/2025 to 18/09/2026",
    status: "Active",
    progress: "Completed",
  },
  {
    id: "4",
    name: "Expense Report",
    subName: "Shraddha Swant",
    date: "12/09/2025 to 18/09/2026",
    status: "Active",
    progress: "Completed",
  },
];

export default function SiteReport() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Company Info */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/40/40" }} // Replace with actual logo
          style={styles.logo}
        />
        <Text style={styles.headerText}>JMD Constructions</Text>
      </View>

      {/* Project Section */}
      <View style={styles.projectSection}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.projectTitle}>JJ Hormany</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/300x200" }} // Replace with actual image
          style={styles.projectImage}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Text style={styles.tabText}>Assign Task</Text>
        <Text style={[styles.tabText, styles.activeTab]}>Report</Text>
        <Text style={styles.tabText}>Attendance</Text>
        <Text style={styles.tabText}>Labour</Text>
      </View>

      {/* Report List */}
      <FlatList
        data={reports}
        renderItem={({ item }) => (
          <Task_Box
            item={{
              name: item.name,
              subName: item.subName,
              date: item.date,
              status: item.status,
              progress: item.progress,
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
      />

      {/* Generate Report Button */}
      <TouchableOpacity style={styles.generateButton} onPress={() => alert("Generate Report clicked")}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0247D3",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "flex-start",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
  },
  projectSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F5F5F5",
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  projectImage: {
    width: 100,
    height: 75,
    resizeMode: "cover",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D0D5DD",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTab: {
    color: "#0247D3",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#0247D3",
  },
  generateButton: {
    backgroundColor: "#0247D3",
    padding: 15,
    alignItems: "center",
    margin: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});