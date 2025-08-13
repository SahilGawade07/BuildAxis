import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Addmaterial from "./tasks/common/addmaterial";

// Define type for each item
type MaterialItem = {
  id: string;
  name: string;
  qty: string;
  unit: string;
  srNo: string;
};

export default function ItemTable() {
  // Typed array
  const data: MaterialItem[] = [
    { id: "1", name: "Bricks", qty: "10000", unit: "pcs", srNo: "1" },
    { id: "2", name: "Cement", qty: "500", unit: "bags", srNo: "2" },
    { id: "3", name: "Sand", qty: "20", unit: "trucks", srNo: "3" },
    { id: "4", name: "Wood Planks", qty: "1500", unit: "pcs", srNo: "4" },
  ];

  // Add type to renderItem parameter
  const renderItem = ({ item }: { item: MaterialItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemLeft}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>
            {item.srNo}. {item.name}
          </Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.quantity}>{item.qty}</Text>
        <Text style={styles.unit}>{item.unit}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Addmaterial text="material" text2="Add materials" />

      {/* List */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#0247D3",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemRight: {
    alignItems: "flex-end",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  unit: {
    fontSize: 13,
    color: "#888",
  },
  separator: {
    height: 12,
  },
});
