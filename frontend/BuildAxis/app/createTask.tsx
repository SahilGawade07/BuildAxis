import Back_Text_Butt from "@/Components/Common/backBtn";
import { CompanyBar } from "@/Components/Common/companyBar";
import AttendanceSummary from "@/Components/Sites/attandanceScreen";
import { Inventory } from "@/Components/Sites/InventoryScreen";
import { Task_Box } from "@/Components/Sites/taskBox";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ExpencessScreen } from "@/Components/Sites/expencessScreen";
import ItemTable from "@/Components/Sites/itemScreen";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Labour_list from "@/Components/Sites/labourScreen";
import Report from "@/Components/Sites/report";
import { Safe_area } from "@/Components/Common/safeArea";
import { Colors } from "react-native/Libraries/NewAppScreen";

const HEADER_MAX_HEIGHT = 370;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function DynamicHeaderScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Shrinking height
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50], // shrink in first 100px
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100], // hide quickly instead of over 300px
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  // Slide content up faster
  const headerContentTranslateY = scrollY.interpolate({
    inputRange: [0, 100], // quicker movement
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

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

          <ScrollView >
            <FlatList
              data={projects}
              renderItem={Task_Box}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingTop: 10 }}
            />
          </ScrollView>
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
    <SafeAreaView style={styles.container}>
      {/* Dynamic Header */}
       <Safe_area/>
       <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View
          style={{
            opacity: headerContentOpacity,
            transform: [{ translateY: headerContentTranslateY }],
          }}
        >
         
          <CompanyBar />
          <Back_Text_Butt path="/tabs/Sites/Site" text="Site Name" />

          <View style={{ height: 200, padding: 5, alignItems: "center" }}>
            <Image
              source={require("@/assets/images/Construction.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </View>

          <View style={{ flexDirection: "row" }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.menuScroll}
            >
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setActive(item)}
                  style={styles.menuItem}
                >
                  <Text
                    style={[
                      styles.text,
                      active === item && styles.activeText1,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={{ height: 800 }}>
          {renderPageContent()}

        </View>

      </Animated.ScrollView>
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
    backgroundColor: "#f4f4f4",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffffff",
    zIndex: 1,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT,
  },
  item: {
    backgroundColor: "white",
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 8,
    elevation: 2,
  },
  itemText: {
    fontSize: 18,
  },
  menuScroll: {
    paddingHorizontal: 5,
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
