import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PrimaryBtn = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.assignBtn} onPress={onPress}>
      <Text style={styles.assignBtnText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  assignBtn: {
    backgroundColor: "#0A58FF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },
  assignBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PrimaryBtn;
