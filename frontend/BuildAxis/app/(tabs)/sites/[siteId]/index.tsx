import Back_Text_Butt from "@/components/ui/backBtn";
import { Safe_area } from "@/components/ui/safeArea";
import { CompanyBar } from "@/components/ui/orgNameBar";
import AttendanceSummary from "@/app/(tabs)/sites/[siteId]/tabs/attandanceScreen";
import { Inventory } from "@/app/(tabs)/sites/[siteId]/tabs/InventoryScreen";
import { TaskBox } from "@/components/Sites/taskBox";
import { Ionicons } from "@expo/vector-icons";
import { ExpencessScreen } from "@/app/(tabs)/sites/[siteId]/tabs/expencessScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import Report from "@/app/(tabs)/sites/[siteId]/tabs/report";
import { useTheme } from "../../../../context/ThemeContext"; 

export default function Main_Site() {
  const [active, setActive] = useState("Assign Task");
  const [page, setPage] = useState("Assign Task");
  const { theme } = useTheme(); // ✅ use theme

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
            renderItem={TaskBox}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 10 }}
          />
        );
      case "Report":
        return <Report />;
      case "Attendance":
        return <AttendanceSummary />;
      case "Labour":
        return <Labour_list />;
      case "Inventory":
        return <Inventory />;
      case "Material":
        return <ItemTable />;
      case "Expencess":
        return <ExpencessScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Safe_area />
      <ScrollView>
        <CompanyBar />
        <Back_Text_Butt path="/tabs/Sites/Site" text="Site Name" />

        {/* Header Image */}
        <View style={{ height: 200, padding: 5, alignItems: "center" }}>
          <Image
            source={require("@/assets/images/Construction.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Tab Bar */}
        <View
          style={[
            styles.tabBarContainer,
            { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {menuItems.map((item) => {
              const isActive = active === item;
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => setActive(item)}
                  style={[
                    styles.tabItem,
                    isActive && { borderBottomColor: theme.secondary },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: theme.text },
                      isActive && { color: theme.secondary },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Arrow */}
          <TouchableOpacity style={styles.arrowBtn}>
            <Ionicons name="chevron-forward" size={18} color={theme.icons} />
          </TouchableOpacity>
        </View>

        {/* Page Content */}
        {renderPageContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  arrowBtn: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
