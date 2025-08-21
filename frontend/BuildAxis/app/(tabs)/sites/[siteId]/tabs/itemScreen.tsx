import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Modal } from "react-native";
import Addmaterial from "../../../../../components/Sites/tasks/common/addmaterial";
import { BlurView } from "expo-blur";
import Addtools from "../../../../../components/Sites/popupScreens/addToolsPopup";
import { useTheme } from "../../../../../context/ThemeContext";
import { Addbuttons } from "@/components/ui/addbutton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesome6 } from "@expo/vector-icons";

// Define type for each item
type MaterialItem = {
  id: string;
  name: string;
  qty: string;
  unit: string;
  srNo: string;
};

export default function ItemTable() {
  const { theme } = useTheme();
  const [popup, setpopup] = useState(false);

  const data: MaterialItem[] = [
    { id: "1", name: "Bricks", qty: "10000", unit: "pcs", srNo: "1" },
    { id: "2", name: "Cement", qty: "500", unit: "bags", srNo: "2" },
    { id: "3", name: "Sand", qty: "20", unit: "trucks", srNo: "3" },
    { id: "4", name: "Wood Planks", qty: "1500", unit: "pcs", srNo: "4" },
  ];

  const activepopup = () => setpopup(!popup);

  // Render items with themed colors
  const renderItem = ({ item }: { item: MaterialItem }) => (
    <View
      style={[
        styles.itemCard,
        { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder },
      ]}
    >
      <View style={styles.itemLeft}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: theme.text }]}>
            {item.srNo}. {item.name}
          </Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.quantity, { color: theme.text }]}>{item.qty}</Text>
        <Text style={[styles.unit, { color: theme.icons }]}>{item.unit}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}


      {/* List */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={popup}
        onRequestClose={() => setpopup(false)}
      >
        <BlurView
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0, 0, 0, 0.67)" }, // overlay
          ]}
          tint={theme.isDark ? "dark" : "light"}
          intensity={20}
        />
        <View style={styles.overlay}>
          <Addtools fun={activepopup} />
        </View>
      </Modal>

      {/* Floating Add Button */}
    <Addbuttons
      iconname={<FontAwesome6 name="add" size={20} color="white" />}
      functions={activepopup} // ✅ trigger popup on press
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
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
  },
  itemRight: {
    alignItems: "flex-end",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  unit: {
    fontSize: 13,
  },
  separator: {
    height: 12,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
