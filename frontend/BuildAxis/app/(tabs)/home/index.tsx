import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { CompanyBar } from "@/components/ui/companyBar";
import { Safe_area } from "@/components/ui/safeArea";
import { Overview } from "@/components/ui/summaryBoxes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme } = useTheme(); // ✅ get theme

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Safe_area />
      <CompanyBar />
      
      {/* Date Row */}
      <View style={styles.dateRow}>
        <Text style={[styles.todayText, { color: theme.text }]}>Today</Text>
        <View
          style={[
            styles.dateBox,
            { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder },
          ]}
        >
          <Ionicons name="calendar-outline" size={16} color={theme.icons} />
          <Text style={[styles.dateText, { color: theme.text }]}>12/09/2025</Text>
        </View>
      </View>

      {/* Grid Cards */}
      <View style={styles.grid}>
        <Overview
          backgroundColor={theme.boxes01[0]}
          circle_color={theme.boxes01[1]}
          Ionicons_name="people"
          Ionicons_color={theme.boxes01[2]}
          Text1="Attendance"
          text2="Supervisor: 20"
          text3="Labours: 100"
        />
        <Overview
          backgroundColor={theme.boxes02[0]}
          circle_color={theme.boxes02[1]}
          Ionicons_name="cash-outline"
          Ionicons_color={theme.boxes02[2]}
          Text1="Daily Expensces"
          text2="10000 Rs"
          text3=""
        />
        <Overview
          backgroundColor={theme.boxes03[0]}
          circle_color={theme.boxes03[1]}
          Ionicons_name="cube-outline"
          Ionicons_color={theme.boxes03[2]}
          Text1="Inventory"
          text2="Crush sand is required."
          text3="Bricks are required."
        />
        <Overview
          backgroundColor={theme.boxes04[0]}
          circle_color={theme.boxes04[1]}
          Ionicons_name="construct-outline"
          Ionicons_color={theme.boxes04[2]}
          Text1="Sites"
          text2="Active: 7"
          text3="Inactive: 4"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    paddingHorizontal: 15,
  },
  todayText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 15,
  },
});
