import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

type AddMaterialProps = {
  text: string;
  onPress?: () => void;
};

export default function AddMaterial({ text, text2,funcations}: any) {
  return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{text}</Text>
        <TouchableOpacity style={styles.addButton} onPress={funcations}>
          <FontAwesome6 name="plus" size={16} color="#0247D3" />
          <Text style={styles.addButtonText}>{text2}</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
  },
  rowText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0247D3",
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
});
