import Back_Text_Butt from "@/components/ui/backBtn";
import { CompanyBar } from "@/components/ui/companyBar";
import AttendanceSummary from "@/app/(tabs)/sites/[siteId]/tabs/attandanceScreen";
import { Inventory } from "@/app/(tabs)/sites/[siteId]/tabs/InventoryScreen";
import { TaskBox } from "@/components/Sites/taskBox";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ExpencessScreen } from "@/app/(tabs)/sites/[siteId]/tabs/expencessScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import Report from "@/app/(tabs)/sites/[siteId]/tabs/report";
// import { Safe_area } from "@/components/Common/safeArea";
import { Colors } from "@/Thems/color";

import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, StatusBar, Animated, FlatList, ScrollView, Image, StyleSheet, Text, TouchableOpacity, View, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Safe_area } from "@/components/ui/safeArea";

const HEADER_MAX_HEIGHT = 390;
const HEADER_MIN_HEIGHT = 50;

export default function DynamicHeaderScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState("Assign Task");
  const [page, setPage] = useState("Assign Task");

  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height - insets.top;
  const router = useRouter();

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

  useEffect(() => setPage(active), [active]);

  const renderPageContent = () => {
    switch (page) {
      case "Assign Task":
        return (
          <ScrollView>
            <FlatList
              data={projects}
              renderItem={TaskBox}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingTop: 10 }}
            />
          </ScrollView>
        );
      case "Report": return <Report />;
      case "Attendance": return <AttendanceSummary />;
      case "Labour": return <Labour_list />;
      case "Inventory": return <Inventory />;
      case "Material": return <ItemTable />;
      case "Expencess": return <ExpencessScreen />;
      default: return null;
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const headerContentTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
    
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Dynamic Header */}
      <Animated.View style={[styles.header, { height: headerHeight, paddingTop: insets.top }]}>
        <Animated.View style={{ opacity: headerContentOpacity, transform: [{ translateY: headerContentTranslateY }] }}>
          <CompanyBar />
                <Safe_area />
          
          <Back_Text_Butt path="/tabs/Sites/Site" text="Site Name" />

          <View style={{ height: 200, padding: 5, alignItems: "center" }}>
            <Image source={require("@/assets/images/Construction.png")} style={{ width: "100%", height: "100%" }} />
          </View>

          <View style={{ flexDirection: "row" }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menuScroll}>
              {menuItems.map((item) => (
                <TouchableOpacity key={item} onPress={() => setActive(item)} style={styles.menuItem}>
                  <Text style={[styles.text, active === item && styles.activeText1]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Sticky header when collapsed */} 
      <Animated.View style={{ backgroundColor: "#fff", zIndex: 2, position: "absolute", opacity: Animated.subtract(1, headerContentOpacity), paddingTop:insets.top,width:"100%"}}>
        <Back_Text_Butt path="/tabs/Sites/Site" text={page} />
      </Animated.View>

      {/* Scroll Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        // style={{paddingTop:insets.top}}
      >
         {/* <Safe_area /> */}
        <View style={{ height: windowHeight }}>{renderPageContent()}</View>
      </Animated.ScrollView>

      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push("../CreateReport")} activeOpacity={0.8}>
        <Text style={styles.floatingButtonText}>Generate Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  header: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    zIndex: 1,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollContent: { paddingTop: HEADER_MAX_HEIGHT },
  menuScroll: { paddingHorizontal: 5 },
  menuItem: { paddingHorizontal: 10, paddingVertical: 8 },
  text: { fontSize: 18, color: "gray" },
  activeText1: { color: "#1976D2", textDecorationLine: "underline", fontWeight: "500" },
  arrowBtn: { paddingHorizontal: 6, justifyContent: "center" },
  floatingButton: {
    position: "absolute", bottom: 20, left: 20, right: 20,
    backgroundColor: "#0247D3", paddingVertical: 14,
    borderRadius: 8, alignItems: "center",
    elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  floatingButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});



