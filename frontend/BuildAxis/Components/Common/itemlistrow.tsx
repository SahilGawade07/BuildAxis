import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";


export  const Itemrow = ({ item, index }:any) => (
    <View style={styles.row}>
      <Text style={[styles.itemText, { flex: 3 }]}>
        <Text style={styles.bold}>{index + 1}. </Text>
        {item.name}
      </Text>
      <Text style={[styles.itemText, { flex: 1, textAlign: "right" }]}>
        {item.qty}
      </Text>
    </View>
  );



  const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    marginBottom: 4,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 13,
    color: "gray",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  itemText: {
    fontSize: 14,
  },
  bold: {
    fontWeight: "bold",
  },
});
