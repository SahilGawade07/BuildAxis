import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import LabourList from "@/components/ui/labourList";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const data = [
  { id: "1", name: "Shraddha Swant" },
  { id: "2", name: "Shraddha Swant" },
  { id: "3", name: "Shraddha Swant" },
  { id: "4", name: "Shraddha Swant" },
];

export default function Labour_list() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <FlatList
        data={data}
        renderItem={({ item }) => <LabourList item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: theme.sepratorLine }]}
          />
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.secondary }]}
        onPress={() => {
          router.push("/(tabs)/sites/[siteId]/labourDetails");
        }}
      >
        <FontAwesome6 name="add" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  fab: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    right: 20,
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  separator: {
    height: 1,
  },
});
