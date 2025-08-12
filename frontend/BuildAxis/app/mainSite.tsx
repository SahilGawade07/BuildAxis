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
import { Inventory } from "@/Components/Sites/Inventory_screen";
import Labour_list from "@/Components/Sites/labour_scree"
import AttendanceSummary from "@/Components/Sites/attandance_screen"
import Report from "@/Components/Sites/report";
export default function Main_Site() {
  const router = useRouter();
  const [active, setActive] = useState("Assign Task");
  const [page, setPage] = useState("Assign Task");

  const menuItems = [
    "Assign Task",
    "Report",
    "Attendance",
    "Labour",
    "Inventory",
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
            contentContainerStyle={{ paddingTop: 10 }}
          />
        );
      case "Report":
        return (
          <Report />
        );
      case "Attendance":
        return (
          <AttendanceSummary />
        );
      case "Labour":
        return (
          <Labour_list />
        );
      case "Inventory":
        return (
          <Inventory />
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
      <Safe_area />
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

});
