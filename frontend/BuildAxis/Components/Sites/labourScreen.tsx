import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import LabourList from "@/Components/Common/labourList";
const data = [
  { id: "1", name: "Shraddha Swant" },
  { id: "2", name: "Shraddha Swant" },
  { id: "3", name: "Shraddha Swant" },
  { id: "4", name: "Shraddha Swant" },
];

export default function Labour_list() {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={LabourList}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
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
    alignItems: "center",
    marginRight: 10,
  },
});
