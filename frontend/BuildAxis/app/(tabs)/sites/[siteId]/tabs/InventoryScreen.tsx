import React from "react";
import { StyleSheet, View } from "react-native";
import { Overview } from "../../../../../components/ui/summaryBoxes";
import { useTheme } from "../../../../../context/ThemeContext"; // ✅ import theme

export const Inventory = ({ item }: any) => {
  const { theme } = useTheme(); // ✅ get active theme

  return (
    <View style={[styles.grid, { backgroundColor: theme.background }]}>
      <Overview
        variant="boxes01"
        Ionicons_name="people"
        Text1="Attendance"
        text2="Supervisor: 20"
        text3="Labours: 100"
      />
      <Overview
        variant="boxes02"
        Ionicons_name="cash-outline"
        Text1="Daily Expenses"
        text2="10000 Rs"
        text3=""
      />
      <Overview
        variant="boxes03"
        Ionicons_name="cube-outline"
        Text1="Inventory"
        text2="Crush sand is required."
        text3="Bricks are required."
      />
      <Overview
        variant="boxes04"
        Ionicons_name="construct-outline"
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
