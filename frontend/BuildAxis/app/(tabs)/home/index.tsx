// ✅ Home.tsx (improved layout)
import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompanyBar } from "@/components/ui/companyBar";
import { Safe_area } from "@/components/ui/safeArea";
import { Overview } from "@/components/ui/summaryBoxes";
import { useTheme } from "@/context/ThemeContext";
import DateSelector from "@/components/ui/dateSelector";

export default function Home() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Safe_area />
      <CompanyBar />

      {/* Date Row */}
      <View style={styles.dateRow}>
        <Text style={[styles.todayText, { color: theme.text }]}>Today</Text>
        <View
          style={[
          ]}
        >
          <DateSelector/>
          

        </View>
      </View>

      {/* Grid Overview */}
      <View style={styles.grid}>
        <Overview
          variant="boxes01"
          Text1="Attendance"
          text2="Supervisor: 20"
          text3="Labours: 100"
          icon={<Ionicons name="people" size={40} color={theme.boxes01[2]} />}
        />


        <Overview
          variant="boxes02"
          Text1="Daily Expenses"
          text2="10,000 Rs"
          icon={<Feather name="trending-up"  size={40} color={theme.boxes02[2]} />}
        />

        <Overview
          variant="boxes03"
          Text1="Inventory"
          text2="Crush sand is required."
          text3="Bricks are required."
          icon={<FontAwesome5 name="boxes" size={40} color={theme.boxes03[2]} />}
        />

        <Overview
          variant="boxes04"
          Text1="Sites"
          text2="Active: 7"
          text3="Inactive: 4"
          icon={<MaterialCommunityIcons name="pier-crane" size={40} color={theme.boxes04[2]} />}
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
    marginVertical: 12,
    paddingHorizontal: 18,
  },
  todayText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});
