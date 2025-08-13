import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ItemTable() {
  const data = [
    {
      id: "1",
      name: "Bricks",
      itemNumber: "Item #1",
      qty: "10000",
      unit: "pcs",
      srNo: "1",
      iconBg: "#E3F2FD",
    },
    {
      id: "2",
      name: "Cement",
      itemNumber: "Item #2",
      qty: "500",
      unit: "bags",
      srNo: "2",
      iconBg: "#E8F5E8",
    },
    {
      id: "3",
      name: "Sand",
      itemNumber: "Item #3",
      qty: "20",
      unit: "trucks",
      srNo: "3",
      iconBg: "#FFF3E0",
    },
    {
      id: "4",
      name: "Wood Planks",
      itemNumber: "Item #4",
      qty: "1500",
      unit: "pcs",
      srNo: "4",
      iconBg: "#F3E5F5",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
          <FontAwesome6 name={item.icon} size={20} color="#666" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemNumber}>{item.itemNumber}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Materials</Text>
        <TouchableOpacity style={styles.addButton}>
          <FontAwesome6 name="plus" size={16} color="#0247D3" />
          <Text style={styles.addButtonText}>Add Material</Text>
        </TouchableOpacity>
      </View>

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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemNumber: {
    fontSize: 13,
    color: "#888",
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
