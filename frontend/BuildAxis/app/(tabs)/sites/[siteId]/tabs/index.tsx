import React from "react";
import { useWindowDimensions, StyleSheet, View } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import AttendanceSummary from "@/app/(tabs)/sites/[siteId]/tabs/attandanceScreen";
import { Inventory } from "@/app/(tabs)/sites/[siteId]/tabs/InventoryScreen";
import { TaskBox } from "@/components/Sites/taskBox";
import { ExpencessScreen } from "@/app/(tabs)/sites/[siteId]/tabs/expencessScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import Report from "@/app/(tabs)/sites/[siteId]/tabs/report";
import { Assigntask } from "./assigntask";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Main_Sites({ dropped }: any) {
  const { theme } = useTheme();
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets(); // ✅ get safe area

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "task", title: "Assign Task" },
    { key: "report", title: "Report" },
    { key: "attendance", title: "Attendance" },
    { key: "labour", title: "Labour" },
    { key: "inventory", title: "Inventory" },
    { key: "material", title: "Material" },
    { key: "expencess", title: "Expencess" },
  ]);

  const renderScene = ({ route }: any) => {
    const paddingBottom = dropped
      ? layout.height - (layout.height - 300 - insets.top-insets.bottom-insets.bottom)
      :layout.height - (layout.height - 68 - insets.top-insets.bottom-insets.bottom)
// console.log(insets.bottom)
// console.log("height asas ",layout.height-68-insets.top)
// console.log("statausbar ",insets.top)

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
    <View style={{ flex: 1, minHeight: layout.height }}>
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
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
});
