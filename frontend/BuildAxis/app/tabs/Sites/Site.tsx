import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CompanyBar } from "@/Components/reusable";
import { Safe_area } from "@/Components/Common/safe_area";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const router = useRouter(); // Navigation hook from expo-router

export default function Site() {
  // Dummy project list data
  const projects = [
    { id: "1", name: "JJ Hormony", progress: "20%", date: "12/02/2022", status: "Active" },
    { id: "2", name: "Green Heights", progress: "45%", date: "15/04/2023", status: "Active" },
    { id: "3", name: "Sky Towers", progress: "75%", date: "01/10/2024", status: "Active" },
    { id: "4", name: "Blue Ocean", progress: "60%", date: "20/08/2025", status: "Active" },
  ];

  // Function to render each project card in FlatList
  const renderProject = ({ item }: any) => (
    <TouchableOpacity style={styles.sitecard} onPress={()=>{router.push("/main_site")}}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        {/* Left side: Project image placeholder + name */}
        <View style={styles.cardHeaderLeft}>
          <View style={styles.imageBox}>
            <Ionicons name="image-outline" size={28} color="#888" />
          </View>
          <Text style={styles.sitename}>{item.name}</Text>
        </View>

        {/* Right side: Active badge */}
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>{item.status}</Text>
        </View>
      </View>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        {/* Project progress */}
        <View style={styles.progressRow}>
          <Ionicons name="radio-button-off" size={18} color="#0057FF" />
          <Text style={styles.progressText}>{item.progress}</Text>
        </View>

        {/* Project date */}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color="#000" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {/* Menu button */}
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={22} color="#000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Safe Area component */}
      <Safe_area />

      {/* Company header bar */}
      <CompanyBar />

      {/* Section title */}
      <Text style={styles.sectionTitle}>Projects</Text>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {/* Project list */}
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Floating action button (FAB) to create new task */}
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
        onPress={() => { router.push("/create_task"); }}
      >
        <FontAwesome6 name="add" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Section title styling
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginHorizontal: 15,
  },

  // Search bar container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    margin: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchInput: { flex: 1, height: 40, color: "#000" },

  // Image placeholder box
  imageBox: {
    width: 50,
    height: 50,
    backgroundColor: "#EAEFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  // Card header styling
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center" },

  // Active status badge
  activeBadge: {
    backgroundColor: "#0057FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: "center",
  },
  activeText: { color: "#fff", fontSize: 12, fontWeight: "500" },

  // Card footer styling
  cardFooter: {
    borderTopWidth: 1.5,
    marginTop: 10,
    paddingTop: 10,
    borderColor: "#B2B2B2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Progress & date rows
  progressRow: { flexDirection: "row", alignItems: "center" },
  progressText: { marginLeft: 4, fontSize: 12, color: "#000" },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { marginLeft: 4, fontSize: 12, color: "#000" },

  // Project card styling
  sitecard: {
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.6,
    borderColor: "#D0D5DD",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },

  // Project name text
  sitename: { fontSize: 14, fontWeight: "500" },
});
