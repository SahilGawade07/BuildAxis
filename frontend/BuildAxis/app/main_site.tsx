import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { CompanyBar } from "@/Components/reusable";
import { Safe_area } from "@/Components/Common/safe_area";
import Back_Text_Butt from "@/Components/Common/back_butt";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Task_Box } from "@/Components/Sites/task_box";

export default function Main_Site() {
  const router = useRouter();
  const [active, setActive] = useState("Assign Task");
  const [page, setPage] = useState("Assign Task");

  const menuItems = [
    "Assign Task",
    "Report",
    "Attendance",
    "Labour",
    "Material",
    "Expencess",
  ];

  const projects = [
    { id: "1", name: "JJ Hormony", progress: "20%", date: "12/02/2022", status: "Active" },
    { id: "2", name: "Green Heights", progress: "45%", date: "15/04/2023", status: "Active" },
    { id: "3", name: "Sky Towers", progress: "75%", date: "01/10/2024", status: "Active" },
    { id: "4", name: "Blue Ocean", progress: "60%", date: "20/08/2025", status: "Active" },
  ];

  useEffect(() => {
    setPage(active);
  }, [active]);

  const renderPageContent = () => {
    switch (page) {
      case "Assign Task":
        return (
          <FlatList
            data={projects}
            renderItem={Task_Box}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        );
      case "Report":
        return (
          <View style={styles.pageBox}>
            <Text style={styles.pageText}>Report Screen Content</Text>
          </View>
        );
      case "Attendance":
        return (
          <View style={styles.pageBox}>
            <Text style={styles.pageText}>Attendance Screen Content</Text>
          </View>
        );
      case "Labour":
        return (
          <View style={styles.pageBox}>
            <Text style={styles.pageText}>Labour Screen Content</Text>
          </View>
        );
      case "Material":
        return (
          <View style={styles.pageBox}>
            <Text style={styles.pageText}>Material Screen Content</Text>
          </View>
        );
      case "Expencess":
        return (
          <View style={styles.pageBox}>
            <Text style={styles.pageText}>Expenses Screen Content</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Safe_area  />
      <CompanyBar />
      <Back_Text_Butt path="/tabs/Sites/Site" text="Site Name" />

      {/* Header Image */}
      <View style={{ height: 300, padding: 5, alignItems: "center" }}>
        <Image
          source={require("@/assets/images/Construction.png")}
          style={{ width: 450, height: "100%" }}
        />
      </View>

      {/* Menu */}
      <View style={{ flexDirection: "row" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {menuItems.map((item) => (
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
        </ScrollView>
        <TouchableOpacity style={styles.arrowBtn}>
          <Ionicons name="chevron-forward" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Page Content */}
      {renderPageContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  text: {
    fontSize: 18,
    color: "gray",
  },
  activeText1: {
    color: "#1976D2",
    textDecorationLine: "underline",
    textDecorationColor: "#1976D2",
    fontWeight: "500",
  },
  arrowBtn: {
    paddingHorizontal: 6,
    justifyContent: "center",
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
    backgroundColor: "#F5F5F5",
    margin: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#000",
  },
  imageBox: {
    width: 50,
    height: 50,
    backgroundColor: "#EAEFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeBadge: {
    backgroundColor: "#0057FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: "center",
  },
  activeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  cardFooter: {
    borderTopWidth: 1.5,
    marginTop: 10,
    paddingTop: 10,
    borderColor: "#B2B2B2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#000",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#000",
  },
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
  pageBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageText: {
    fontSize: 18,
    color: "#444",
    fontWeight: "500",
  },
  sitename: {
    fontSize: 16,
    fontWeight: "500",
  },
});
