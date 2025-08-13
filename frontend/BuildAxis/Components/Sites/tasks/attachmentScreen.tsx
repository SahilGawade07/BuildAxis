import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MaterialsScreen() {
  const data = [
    { id: "1", name: "Blue print" },
    { id: "2", name: "Blue print" },
    { id: "3", name: "Blue print" },
    { id: "4", name: "Blue print" },

  ];

  const renderItem = ({ item }:any) => (
    <View style={styles.item}>
      <View style={styles.imageBox}>
        <Ionicons name="image" size={40} color="#4A90E2" />
      </View>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Materials</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add-circle-outline" size={18} color="#007AFF" />
          <Text style={styles.addText}>Add Material</Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: { fontSize: 16, fontWeight: "600", color: "#333" },
  addBtn: { flexDirection: "row", alignItems: "center" },
  addText: { fontSize: 13, color: "#007AFF", marginLeft: 4 },
  item: { alignItems: "center", marginBottom: 20 },
  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: "#EAF1FF",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  addIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: "#EAF1FF",
  },
  itemText: { fontSize: 12, marginTop: 5, color: "#555" },
});
