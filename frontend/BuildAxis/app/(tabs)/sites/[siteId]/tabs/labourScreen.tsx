import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
  Animated,
} from "react-native";
import LabourList from "@/components/ui/labourList";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const data = [
  { id: "1", name: "Shraddha Swant" },
  { id: "2", name: "Pratik Patil" },
  { id: "3", name: "Anjali Deshmukh" },
  { id: "4", name: "Rohan Mehta" },
];

export default function Labour_list() {
  const router = useRouter();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleAddPress = () => {
    router.push("/(tabs)/sites/[siteId]/tabs/labourDetails");
  };

  // Enhanced Empty State
  const renderEmptyList = () => (
    <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: theme.backgroundgrey },
        ]}
      >
        <FontAwesome6 name="user-group" size={48} color={theme.icons} />
      </View>
      <Text style={[styles.emptyText, { color: theme.text }]}>
        No Workers Added Yet
      </Text>
      <Text style={[styles.emptySubText, { color: theme.icons }]}>
        Start building your team by adding your first worker
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: theme.primary }]}
        onPress={handleAddPress}
        activeOpacity={0.8}
      >
        <FontAwesome6 name="plus" size={16} color="#fff" />
        <Text style={styles.emptyButtonText}>Add First Worker</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Worker List */}
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <Animated.View
            style={[
              styles.listItemContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.listItemCard,
                { backgroundColor: theme.listItemFill },
              ]}
            >
              <LabourList item={item} isFirst={index === 0} />
            </View>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
            progressBackgroundColor={theme.listItemFill}
          />
        }
      />

      {/* Floating Add Button (only shown if workers exist) */}
      {data.length > 0 && (
        <Animated.View
          style={[
            styles.fabContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.primary }]}
            onPress={handleAddPress}
            activeOpacity={0.8}
            accessibilityLabel="Add new worker"
            accessibilityRole="button"
          >
            <FontAwesome6 name="plus" size={24} color="#fff" />
          </TouchableOpacity>
          <View
            style={[styles.fabShadow, { backgroundColor: theme.primary }]}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  listItemContainer: {
    marginHorizontal: 16,
  },
  listItemCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  itemSeparator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
    minHeight: 400,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    color: "#888",
    opacity: 0.7,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 30,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 2,
  },
  fabShadow: {
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 28,
    opacity: 0.2,
    zIndex: 1,
  },
});
