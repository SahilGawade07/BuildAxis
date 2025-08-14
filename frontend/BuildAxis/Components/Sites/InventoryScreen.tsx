import React from "react";
import {
  StyleSheet,
  View
} from "react-native";
import { Overview } from "../Common/summaryBoxes";

export const Inventory = ({ item }: any) => {
  return (
    <View style={styles.grid}>
      <Overview
        backgroundColor="#DBEDFD"
        circle_color="#B6DEFF"
        Ionicons_name="people"
        Ionicons_color="#4682B4"
        Text1="Attendance"
        text2="Supervisor: 20"
        text3="Labours: 100"
      />
      <Overview
        backgroundColor="#F0FDF4"
        circle_color="#DCFCE7"
        Ionicons_name="cash-outline"
        Ionicons_color="#27AE60"
        Text1="Daily Expenses"
        text2="10000 Rs"
        text3=""
      />
      <Overview
        backgroundColor="#FEFCE8"
        circle_color="#FEF9C3"
        Ionicons_name="cube-outline"
        Ionicons_color="#D4AC0D"
        Text1="Inventory"
        text2="Crush sand is required."
        text3="Bricks are required."
      />
      <Overview
        backgroundColor="#FEF2F2"
        circle_color="#FEE2E2"
        Ionicons_name="construct-outline"
        Ionicons_color="#C0392B"
        Text1="Sites"
        text2="Active: 7"
        text3="Inactive: 4"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 15,
  },
});



