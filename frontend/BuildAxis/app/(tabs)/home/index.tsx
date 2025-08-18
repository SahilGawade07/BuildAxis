import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CompanyBar } from "@/components/ui/companyBar";
import { Safe_area } from "@/components/ui/safeArea";
import { Overview } from "@/components/ui/summaryBoxes";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme } = useTheme(); // ✅ get theme

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Safe_area />
      <CompanyBar />

      {/* Date Row */}
      <View style={styles.dateRow}>
        <Text style={[styles.todayText, { color: theme.text }]}>Today</Text>
        <View
          style={[
            styles.dateBox,
            {
              backgroundColor: theme.listItemFill,
              borderColor: theme.listItemBorder,
            },
          ]}
        >
          <Ionicons name="calendar-outline" size={16} color={theme.icons} />
          <Text style={[styles.dateText, { color: theme.text }]}>
            12/09/2025
          </Text>
        </View>
      </View>

      {/* Grid Cards */}
      <View style={styles.grid}>
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
