import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import LabourList from "@/components/ui/labourList";
import { useRouter } from "expo-router";

const data = [
  { id: "1", name: "Shraddha Swant" },
  { id: "2", name: "Shraddha Swant" },
  { id: "3", name: "Shraddha Swant" },
  { id: "4", name: "Shraddha Swant" },
];

export default function Labour_list() {
  const router = useRouter(); // ✅ moved inside component

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <LabourList item={item} />}
        keyExtractor={(item) => item.id}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          router.push("/labourdetails");
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
    backgroundColor: "#fff",
  },
  fab: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#3B82F6", // ✅ replaced Colors.secondary with fixed color
    position: "absolute",
    right: 20,
    bottom: 40,
    alignItems: "center",
    paddingVertical: 10,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  imageBox: {
    width: 50,
    height: 50,
    backgroundColor: "#EAEFFF",
    borderRadius: 8,
    justifyContent: "center",
    elevation: 5,
  },
});
