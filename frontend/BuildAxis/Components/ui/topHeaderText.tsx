import React from "react";
import { Text, StyleSheet } from "react-native";

//header top
export const TopTextHeader = ({ text }: any) => {
  return <Text style={styles.header}>{text}</Text>;
};

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    fontWeight: "bold",
  },
});

export default TopTextHeader;
