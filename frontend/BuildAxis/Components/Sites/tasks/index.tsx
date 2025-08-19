import * as React from "react";
import { useWindowDimensions, ScrollView, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

// 🔹 Import your screens
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import ImageScreen from "@/components/Sites/tasks/ImageScreen";
import MaterialsScreen from "@/components/Sites/tasks/attachmentScreen";

export default function TopTabs() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "images", title: "Images" },
    { key: "labours", title: "Labours" },
    { key: "materials", title: "Materials" },
    { key: "attachments", title: "Attachments" },
  ]);

  // ✅ wrap each screen inside a ScrollView
  const renderScene = SceneMap({
    images: () => (
      <>
        <ImageScreen />
      </>
    ),
    labours: () => (
      <ScrollView style={{ flex: 1 }}>
        {/* <Labour_list /> */}
      </ScrollView>
    ),
    materials: () => (
      <ScrollView style={{ flex: 1 }}>
        <ItemTable />
      </ScrollView>
    ),
    attachments: () => (
      <ScrollView style={{ flex: 1 }}>
        <MaterialsScreen />
      </ScrollView>
    ),
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "#007AFF", height: 3 }}
          style={{ backgroundColor: "white" }}
          labelStyle={{ color: "black", fontWeight: "bold" }}
          inactiveColor="#555"
          activeColor="#007AFF"
        />
      )}
    />
  );
}

