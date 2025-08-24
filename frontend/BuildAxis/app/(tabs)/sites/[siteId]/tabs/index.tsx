// const paddingBottom = dropped
//   ? layout.height - (layout.height - 300 - insets.top-insets.bottom-insets.bottom)
//   :layout.height - (layout.height - 68 - insets.top-insets.bottom-insets.bottom)

import React from "react";
import { useWindowDimensions, StyleSheet, View } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import AttendanceSummary from "@/app/(tabs)/sites/[siteId]/tabs/attandanceScreen";
import { Inventory } from "@/app/(tabs)/sites/[siteId]/tabs/InventoryScreen";
import { ExpencessScreen } from "@/app/(tabs)/sites/[siteId]/tabs/expencessScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import Supervisor_list from "@/app/(tabs)/sites/[siteId]/tabs/supervisorScreen";
import Report from "@/app/(tabs)/sites/[siteId]/tabs/report";
import { Assigntask } from "./assigntask";
import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams } from "expo-router";

export default function Main_Sites() {
  const { theme } = useTheme();
  const layout = useWindowDimensions();
  const { siteId, siteName } = useLocalSearchParams();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "task", title: "Tasks" },
    { key: "report", title: "Reports" },
    { key: "attendance", title: "Attendance" },
    { key: "supervisor", title: "Supervisors" },
    { key: "labour", title: "Labours" },
    { key: "inventory", title: "Inventory" },
    { key: "material", title: "Materials" },
    { key: "expencess", title: "Expencess" },
  ]);

  const renderScene = ({ route }: any) => {
    console.log(siteId);
    switch (route.key) {
      case "task":
        return (
          <View style={styles.tabContent}>
            <Assigntask />
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
      case "supervisor":
        return (
          <View style={styles.tabContent}>
            <Supervisor_list />
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
            tabStyle={{}}
            activeColor={theme.secondary}
            inactiveColor={theme.text}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
  },
});
