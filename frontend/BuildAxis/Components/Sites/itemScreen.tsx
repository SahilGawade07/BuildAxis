import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import Addmaterial from "./tasks/common/addmaterial";
import { BlurView } from "expo-blur";
import Addtools from "./popupScreens/addToolsPopup";
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
    const [popup, setpopup] = useState(false);
  
  const activepopup = () => {
    const update=!popup;
    setpopup(update);

  }
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
      <Addmaterial text="material" text2="Add materials" funcations={activepopup} />

      {/* List */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />


        <Modal
              animationType="fade"
              transparent={true}
              visible={popup}
              onRequestClose={() => setpopup(false)}
            >
      
              <BlurView
                style={[StyleSheet.absoluteFill, {backgroundColor: "rgba(65, 65, 65, 0.84)"}]}
                tint="light"   // "light", "dark", "xlight"
                intensity={20}
              />
              <View style={styles.overlay}>
      
                <Addtools fun={activepopup}/>
              </View>
            </Modal>
      
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
    overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",

  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center"
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
});
