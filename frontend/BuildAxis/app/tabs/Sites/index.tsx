import { Safe_area } from "@/Components/Common/safeArea";
import { CompanyBar } from "@/Components/Common/companyBar";
import { SiteBox } from "@/Components/Sites/siteBox";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";

export default function Site() {
  const router = useRouter();
  const { theme } = useTheme();
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Safe_area />
      <CompanyBar />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Projects</Text>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.backgroundgrey },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={theme.icons}
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search"
          style={[styles.searchInput, { color: theme.text }]}
          placeholderTextColor={theme.icons}
        />
      </View>

      <FlatList
        data={projects}
        renderItem={({ item }) => <SiteBox item={item} />} 
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.secondary }]}
        onPress={() => router.push("/createTask")}
      >
        <FontAwesome6 name="add" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  fab: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    right: 20,
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});