import React, { useState } from "react";
import { useWindowDimensions, StyleSheet, View } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";
import AttendanceSummary from "@/app/(tabs)/sites/[siteId]/tabs/attandanceScreen";
import { Inventory } from "@/app/(tabs)/sites/[siteId]/tabs/InventoryScreen";
import { ExpencessScreen } from "@/app/(tabs)/sites/[siteId]/tabs/expencessScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import Report from "@/app/(tabs)/sites/[siteId]/tabs/report";
import { Assigntask } from "@/app/(tabs)/sites/[siteId]/tabs/assigntask";
import DropImageExample from "@/components/ui/dropdownimg";
import { useTheme } from "@/context/ThemeContext";

export default function Main_Sites() {
  const { theme } = useTheme();
  const layout = useWindowDimensions();

  const [dropped, setDropped] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "task", title: "Assign Task" },
    { key: "report", title: "Report" },
    { key: "attendance", title: "Attendance" },
    { key: "labour", title: "Labour" },
    { key: "inventory", title: "Inventory" },
    { key: "material", title: "Material" },
    { key: "expencess", title: "Expencess" },
  ]);

  const renderScene = ({ route }: any) => {
    const paddingBottom = dropped ? 390 : 170;

    switch (route.key) {
      case "task": return <View style={[styles.tabContent, { paddingBottom }]}><Assigntask /></View>;
      case "report": return <View style={[styles.tabContent, { paddingBottom }]}><Report /></View>;
      case "attendance": return <View style={[styles.tabContent, { paddingBottom }]}><AttendanceSummary /></View>;
      case "labour": return <View style={[styles.tabContent, { paddingBottom }]}><Labour_list /></View>;
      case "inventory": return <View style={[styles.tabContent, { paddingBottom }]}><Inventory /></View>;
      case "material": return <View style={[styles.tabContent, { paddingBottom }]}><ItemTable /></View>;
      case "expencess": return <View style={[styles.tabContent, { paddingBottom }]}><ExpencessScreen /></View>;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Drop header */}
      <DropImageExample onDropChange={(value: boolean) => setDropped(value)} />

      {/* Main Tabs */}
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          swipeEnabled
          animationEnabled
          renderTabBar={(props) => (
            <TabBar
              {...props}
              scrollEnabled
              indicatorStyle={{ backgroundColor: theme.secondary }}
              style={{ backgroundColor: theme.listItemFill, marginBottom: 10 }}
              labelStyle={{ fontWeight: "600" }}
              activeColor={theme.secondary}
              inactiveColor={theme.text}
            />
          )}
          springConfig={{ damping: 25, stiffness: 180, mass: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabContent: { flex: 1 },
});
