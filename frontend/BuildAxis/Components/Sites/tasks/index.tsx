import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PagerView from "react-native-pager-view";
import ImageScreen from "./ImageScreen";
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import MaterialsScreen from "./attachmentScreen";

type Props = {
  pageno?: number; // default page index
};

const tabs = ["Images", "Labours", "Materials", "Attachments"];

export default function Sidesanim({ pageno = 0 }: Props) {
  const pagerRef = React.useRef<PagerView>(null);
  const [active, setActive] = React.useState(pageno);

  // 🔹 When parent changes pageno, update pager
  React.useEffect(() => {
    if (pagerRef.current && pageno !== active) {
      pagerRef.current.setPage(pageno);
      setActive(pageno);
    }
  }, [pageno]);

  const handleTabPress = (index: number) => {
    pagerRef.current?.setPage(index);
    setActive(index);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 Top Tabs */}
      <View style={styles.tabBar}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, active === i && styles.activeTab]}
            onPress={() => handleTabPress(i)}
          >
            <Text style={[styles.tabText, active === i && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 PagerView */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={pageno}
        onPageSelected={(e) => setActive(e.nativeEvent.position)}
      >
        <View key="1" style={styles.page}>
          <ImageScreen />
        </View>

        <View key="2" style={styles.page}>
          <Labour_list />
        </View>

        <View key="3" style={styles.page}>
          <ItemTable />
        </View>

        <View key="4" style={styles.page}>
          <MaterialsScreen />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF", // blue highlight
  },
  tabText: {
    fontSize: 14,
    color: "#555",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
});
