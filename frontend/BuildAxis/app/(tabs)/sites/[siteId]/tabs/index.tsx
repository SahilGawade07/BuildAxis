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
import { useTheme } from "@/context/ThemeContext";

export default function Main_Sites() {
  const { theme } = useTheme();
  const layout = useWindowDimensions();

  // Dummy data for TaskBox
  const projects = [
    { id: "1", name: "JJ Hormony", progress: "20%" ,status:"Active",date:"08-08-2006"},
    { id: "2", name: "Green Heights", progress: "45%" ,status:"Active",date:"08-08-2006"},
  ];

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

  // Dynamic renderScene instead of SceneMap
  const renderScene = ({ route }:any) => {
    switch (route.key) {
      case "task":
        return (
          <View style={styles.tabContent}>
            {projects.map((p) => (
              <TaskBox key={p.id} item={p} />
            ))}
          </View>
        );
      case "report":
        return (
          <View style={styles.tabContent}>
            <Report />
          </View>
        );
      case "attendance":
        return (
          <View style={styles.tabContent}>
            <AttendanceSummary />
          </View>
        );
      case "labour":
        return (
          <View style={styles.tabContent}>
            <Labour_list />
          </View>
        );
      case "inventory":
        return (
          <View style={styles.tabContent}>
            <Inventory />
          </View>
        );
      case "material":
        return (
          <View style={styles.tabContent}>
            <ItemTable />
          </View>
        );
      case "expencess":
        return (
          <View style={styles.tabContent}>
            <ExpencessScreen />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, minHeight: layout.height,paddingBottom:90, }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene} // use dynamic function
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
        animationEnabled
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: theme.secondary }}
            style={{ backgroundColor: theme.listItemFill, marginBottom: 10, marginTop: -20 }}
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
    paddingTop: 0,
    paddingBottom: 80,
  },
});
