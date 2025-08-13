import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Addmaterial from "@/Components/Sites/tasks/common/addmaterial";
import { BlurView } from "expo-blur";
import Addtools from "../popupScreens/addToolsPopup";
import Uploadblueprints from "@/Components/Sites/popupScreens/uploadBlueprints"
export default function MaterialsScreen() {
  const data = [
    { id: "1", name: "Blue print" },
    { id: "2", name: "Blue print" },
    { id: "3", name: "Blue print" },
    { id: "4", name: "Blue print" },

  ];

  const [popup, setpopup] = useState(false);

  const activepopup = () => {
    const update = !popup;
    setpopup(update);

  }

  const renderItem = ({ item }: any) => (
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
      <Addmaterial text="Attachment" text2="Add attachments" funcations={activepopup} />


      {/* Grid */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingTop: 10 }}
      />


      <Modal
        animationType="fade"
        transparent={true}
        visible={popup}
        onRequestClose={() => setpopup(false)}
      >

        <BlurView
          style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(65, 65, 65, 0.84)" }]}
          tint="light"   // "light", "dark", "xlight"
          intensity={20}
        />
        <View style={styles.overlay}>

          <Uploadblueprints fun={activepopup} />
        </View>
      </Modal>

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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    

  },
});
