import * as React from "react";
import {
  useWindowDimensions,
  Text,
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";

type TopTabsProps = {
  handleScroll: (event: any) => void;
};

export default function TopTabs({ handleScroll }: TopTabsProps) {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "List A" },
    { key: "second", title: "Second" },
    { key: "third", title: "List B" },
  ]);

  // ✅ render scenes
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return (
          <FlatList
            data={Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)}
            keyExtractor={(item, index) => index.toString()}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>{item}</Text>
              </View>
            )}
          />
        );
      case "second":
        return (
          <View style={styles.centerPage}>
            <Text style={styles.pageText}>📸 Second Page</Text>
          </View>
        );
      case "third":
        return (
          <FlatList
            data={Array.from({ length: 30 }, (_, i) => `Row ${i + 1}`)}
            keyExtractor={(item, index) => index.toString()}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: "#f5f5f5" }]}>
                <Text style={styles.cardText}>{item}</Text>
              </View>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={styles.indicator}
          style={styles.tabBar}
          renderLabel={({ route, focused }) => (
            <Text style={[styles.label, focused && styles.activeLabel]}>
              {route.title}
            </Text>
          )}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ff0000ff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  indicator: {
    backgroundColor: "#007bff",
    height: 3,
    borderRadius: 2,
  },
  label: {
    color: "#000000ff",
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  activeLabel: {
    color: "#007bff",
    fontWeight: "700",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    height: 80,
    backgroundColor: "#fff",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  centerPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
  },
});
