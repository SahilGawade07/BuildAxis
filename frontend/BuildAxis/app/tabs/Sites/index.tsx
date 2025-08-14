import { Safe_area } from "@/Components/Common/safeArea";
import { CompanyBar } from "@/Components/reusable";
import { Site_box } from "@/Components/Sites/siteBox";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import Colors from "@/Thems/color";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const router = useRouter();

export default function Site() {
  const router = useRouter();

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
      {/* ✅ Set Status Bar color independently */}

      {/* Custom Safe Area (if needed) */}
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
          color={Colors.icons}
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          placeholderTextColor={Colors.icons}
        />
      </View>

      {/* Project list */}
      <FlatList
        data={projects}
        renderItem={Site_box}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          backgroundColor: Colors.secondary,
          position: "absolute",
          right: 20,
          bottom: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          router.push("/createTask");
        }}
      >
        <FontAwesome6 name="add" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.background ,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginHorizontal: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundgrey,
    margin: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text,
  },
  fab: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
    position: "absolute",
    right: 20,
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
