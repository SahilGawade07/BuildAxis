import * as React from "react";
import {
  useWindowDimensions,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";

import ImageBanner from "@/components/Sites/tasks/ImageScreen";
import MaterialsScreen from "@/components/Sites/tasks/attachmentScreen";
import Labour_list from "@/components/Sites/tasks/labour";
import ItemTable from "@/components/Sites/tasks/matarials";
import { useTheme } from "@/context/ThemeContext";

export default function TopTabs() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const { theme } = useTheme();

  const [routes] = React.useState([
    { key: "ImageBanner", title: "Site Images" },
    { key: "Labour_list", title: "Labours" },
    { key: "ItemTable", title: "Metarils" },
    { key: "MaterialsScreen", title: "Attachments" },
  ]);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "ImageBanner":
        return <ImageBanner />;
      case "Labour_list":
        return <Labour_list />;
      case "ItemTable":
        return <ItemTable />;
      case "MaterialsScreen":
        return <MaterialsScreen />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={[styles.indicator, { backgroundColor: theme.secondary }]}
      style={styles.tabBar}
      tabStyle={styles.tabStyle}
      labelStyle={{ fontWeight: "900" }}
      activeColor={theme.secondary}
      inactiveColor={theme.text}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabStyle: {
    width: "auto",
    paddingHorizontal: 13,
  },
  indicator: {
    height: 3,
    borderRadius: 3,
  },
});
