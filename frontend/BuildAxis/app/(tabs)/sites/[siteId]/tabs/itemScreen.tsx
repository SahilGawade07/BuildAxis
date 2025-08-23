// import React, { useState } from "react";
// import { View, Text, StyleSheet, FlatList, Modal } from "react-native";
// import Addmaterial from "../../../../../components/Sites/tasks/common/addmaterial";
// import { BlurView } from "expo-blur";
// import Addtools from "../../../../../components/Sites/popupScreens/addToolsPopup";
// import { useTheme } from "../../../../../context/ThemeContext";
// import { Addbuttons } from "@/components/ui/addbutton";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import { FontAwesome6 } from "@expo/vector-icons";

// // Define type for each item
// type MaterialItem = {
//   id: string;
//   name: string;
//   qty: string;
//   unit: string;
//   srNo: string;
// };

// export default function ItemTable() {
//   const { theme } = useTheme();
//   const [popup, setpopup] = useState(false);

//   const data: MaterialItem[] = [
//     { id: "1", name: "Bricks", qty: "10000", unit: "pcs", srNo: "1" },
//     { id: "2", name: "Cement", qty: "500", unit: "bags", srNo: "2" },
//     { id: "3", name: "Sand", qty: "20", unit: "trucks", srNo: "3" },
//     { id: "4", name: "Wood Planks", qty: "1500", unit: "pcs", srNo: "4" },
//   ];

//   const activepopup = () => setpopup(!popup);

//   // Render items with themed colors
//   const renderItem = ({ item }: { item: MaterialItem }) => (
//     <View
//       style={[
//         styles.itemCard,
//         { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder },
//       ]}
//     >
//       <View style={styles.itemLeft}>
//         <View style={styles.itemInfo}>
//           <Text style={[styles.itemName, { color: theme.text }]}>
//             {item.srNo}. {item.name}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.itemRight}>
//         <Text style={[styles.quantity, { color: theme.text }]}>{item.qty}</Text>
//         <Text style={[styles.unit, { color: theme.icons }]}>{item.unit}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       {/* Header */}


//       {/* List */}
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         ItemSeparatorComponent={() => <View style={styles.separator} />}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* Popup */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={popup}
//         onRequestClose={() => setpopup(false)}
//       >
//         <BlurView
//           style={[
//             StyleSheet.absoluteFill,
//             { backgroundColor: "rgba(0, 0, 0, 0.67)" }, // overlay
//           ]}
//           tint={theme.isDark ? "dark" : "light"}
//           intensity={20}
//         />
//         <View style={styles.overlay}>
//           <Addtools fun={activepopup} />
//         </View>
//       </Modal>

//       {/* Floating Add Button */}
//     <Addbuttons
//       iconname={<FontAwesome6 name="add" size={20} color="white" />}
//       functions={activepopup} // ✅ trigger popup on press
//     />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   itemCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//     borderWidth: 1,
//   },
//   itemLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   itemRight: {
//     alignItems: "flex-end",
//   },
//   quantity: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 2,
//   },
//   unit: {
//     fontSize: 13,
//   },
//   separator: {
//     height: 12,
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../../../../../context/ThemeContext";
import { Addbuttons } from "@/components/ui/addbutton";
import { FontAwesome6 } from "@expo/vector-icons";
import Addtools from "../../../../../components/Sites/popupScreens/addToolsPopup";
import { Swipeable } from "react-native-gesture-handler";

export default function ItemTable() {
  const { theme } = useTheme();
  const [popup, setPopup] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [data, setData] = useState([
    { id: "1", name: "Bricks", qty: "10000", unit: "pcs", srNo: "1" },
    { id: "2", name: "Cement", qty: "500", unit: "bags", srNo: "2" },
    { id: "3", name: "Sand", qty: "20", unit: "trucks", srNo: "3" },
    { id: "4", name: "Wood Planks", qty: "1500", unit: "pcs", srNo: "4" },
  ]);

  const activePopup = () => setPopup(!popup);

  const handleDelete = (item: any) => {
    setData((prev) => prev.filter((i) => i.id !== item.id));
    setConfirmVisible(false);
  };

  const renderRightActions = (item: any) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: theme.primary }]}
        onPress={activePopup}
      >
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: theme.error || "red" }]}
        onPress={() => {
          setSelectedItem(item);
          setConfirmVisible(true);
        }}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: any) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View
        style={[
          styles.itemCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.listItemBorder,
            shadowColor: theme.shadow,
          },
        ]}
      >
        {/* Left */}
        <View style={styles.itemLeft}>
          <View style={styles.srNoBox}>
            <Text style={[styles.srNoText, { color: theme.primary }]}>
              {item.srNo}
            </Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.subText, { color: theme.muted }]}>
              Material
            </Text>
          </View>
        </View>

        {/* Right */}
        <View style={styles.itemRight}>
          <Text style={[styles.quantity, { color: theme.accent }]}>
            {item.qty}
          </Text>
          <Text style={[styles.unit, { color: theme.muted }]}>{item.unit}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Custom Confirm Modal  for delete popup*/}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.confirmTitle, { color: theme.text }]}>
              Confirm Delete
            </Text>
            <Text style={[styles.confirmMsg, { color: theme.muted }]}>
              Are you sure you want to delete{" "}
              <Text style={{ fontWeight: "600" }}>
                {selectedItem?.name}
              </Text>
              ?
            </Text>

            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.primary }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.error || "red" }]}
                onPress={() => handleDelete(selectedItem)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


       {/* Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={popup}
        onRequestClose={() => setPopup(false)}
      >
        <BlurView
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // overlay
          ]}
          tint={theme.isDark ? "dark" : "light"}
          intensity={20}
        />
        <View style={styles.overlay}>
          <Addtools fun={activePopup} header="Add material" buttontxt="Add material"/>
        </View>
      </Modal>

      {/* Floating Add Button */}
    <Addbuttons
      iconname={<FontAwesome6 name="add" size={20} color="white" />}
      functions={activePopup} // ✅ trigger popup on press
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  srNoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  srNoText: { fontWeight: "700", fontSize: 14 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600" },
  subText: { fontSize: 12 },
  itemRight: { alignItems: "flex-end" },
  quantity: { fontSize: 18, fontWeight: "700" },
  unit: { fontSize: 13 },
  separator: { height: 12 },

  // Swipe Actions
  rightActionContainer: { flexDirection: "row", alignItems: "center" },
  actionBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "85%",
    marginHorizontal: 4,
    borderRadius: 12,
  },
  actionText: { color: "white", fontWeight: "600" },

  // Confirm Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  confirmBox: {
    width: "80%",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  confirmTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  confirmMsg: { fontSize: 14, marginBottom: 20 },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginLeft: 10,
  },
  btnText: { color: "white", fontWeight: "600" },
    overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
