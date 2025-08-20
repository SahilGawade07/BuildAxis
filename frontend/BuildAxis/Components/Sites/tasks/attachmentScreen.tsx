import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import Addmaterial from "@/components/Sites/tasks/common/addmaterial";
import Addtools from "../popupScreens/addToolsPopup";
import Uploadblueprints from "@/components/Sites/popupScreens/uploadBlueprints";
import { useTheme } from "@/context/ThemeContext";

export default function MaterialsScreen() {
  const data = [
    { id: "1", name: "Blue print" },
    { id: "2", name: "Blue print" },
    { id: "3", name: "Blue print" },
    { id: "4", name: "Blue print" },
  ];

  const [popup, setpopup] = useState(false);
  const { theme } = useTheme();

  const activepopup = () => setpopup(!popup);

  const renderItem = ({ item }: any) => (
    <View style={[styles.item]}>
      <View
        style={[
          styles.imageBox,
          { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder },
        ]}
      >
        <Ionicons name="image" size={40} color={theme.secondary} />
      </View>
      <Text style={[styles.itemText, { color: theme.text }]}>{item.name}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      {/* <Addmaterial
        text="Attachment"
        text2="Add attachments"
        funcations={activepopup}
      /> */}

      {/* Grid */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingTop: 10 }}
      />

      {/* Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={popup}
        onRequestClose={() => setpopup(false)}
      >
        <BlurView
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.isDark ? "rgba(0,0,0,0.7)" : "rgba(65,65,65,0.3)" },
          ]}
          tint={theme.isDark ? "dark" : "light"}
          intensity={30}
        />
        <View style={styles.overlay}>
          <Uploadblueprints fun={activepopup} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  item: { alignItems: "center", marginBottom: 20 },
  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
  },
  itemText: { fontSize: 12, marginTop: 5 },
  overlay: {
    flex: 1,
    justifyContent: "center",
  },
});
