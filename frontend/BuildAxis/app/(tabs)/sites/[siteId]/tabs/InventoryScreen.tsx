import React from "react";
import { StyleSheet, View } from "react-native";
import { Overview } from "../../../../../components/ui/summaryBoxes";
import { useTheme } from "../../../../../context/ThemeContext"; // ✅ import theme

export const Inventory = ({ item }: any) => {
  const { theme } = useTheme(); // ✅ get active theme

  return (
    <View style={[styles.grid, { backgroundColor: theme.background }]}>
      <Overview
        backgroundColor={theme.boxes01[0]}
        circle_color={theme.boxes01[1]}
        Ionicons_name="people"
        Ionicons_color={theme.boxes01[2]}
        Text1="Attendance"
        text2="Supervisor: 20"
        text3="Labours: 100"
        textColor={theme.text} // ✅ pass text color
      />
      <Overview
        backgroundColor={theme.boxes02[0]}
        circle_color={theme.boxes02[1]}
        Ionicons_name="cash-outline"
        Ionicons_color={theme.boxes02[2]}
        Text1="Daily Expenses"
        text2="10000 Rs"
        text3=""
        textColor={theme.text}
      />
      <Overview
        backgroundColor={theme.boxes03[0]}
        circle_color={theme.boxes03[1]}
        Ionicons_name="cube-outline"
        Ionicons_color={theme.boxes03[2]}
        Text1="Inventory"
        text2="Crush sand is required."
        text3="Bricks are required."
        textColor={theme.text}
      />
      <Overview
        backgroundColor={theme.boxes04[0]}
        circle_color={theme.boxes04[1]}
        Ionicons_name="construct-outline"
        Ionicons_color={theme.boxes04[2]}
        Text1="Sites"
        text2="Active: 7"
        text3="Inactive: 4"
        textColor={theme.text}
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
