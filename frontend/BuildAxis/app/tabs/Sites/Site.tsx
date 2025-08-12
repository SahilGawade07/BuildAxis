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
import { Site_box } from "@/Components/Sites/site_box";
const router = useRouter(); // Navigation hook from expo-router

export default function Site() {
  // Dummy project list data
  const projects = [
    {
      id: "1",
      name: "JJ Hormony",
      progress: "20%",
      date: "12/02/2022",
      status: "Active",
    },
    {
      id: "2",
      name: "Green Heights",
      progress: "45%",
      date: "15/04/2023",
      status: "Active",
    },
    {
      id: "3",
      name: "Sky Towers",
      progress: "75%",
      date: "01/10/2024",
      status: "Active",
    },
    {
      id: "4",
      name: "Blue Ocean",
      progress: "60%",
      date: "20/08/2025",
      status: "Active",
    },
  ];

  

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
        <Ionicons
          name="search"
          size={18}
          color="#999"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {/* Project list */}
      <FlatList
        data={projects}
        renderItem={Site_box}
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
        onPress={() => { router.push("/createTask"); }}
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

});
