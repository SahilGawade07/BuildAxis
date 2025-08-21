import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { BlurView } from "expo-blur";
import Reportui from "@/components/Sites/popupScreens/createreport";
import { FloatingButtons } from "@/components/ui/floatingbutton";

type ReportItem = {
  id: string;
  title: string;
  name: string;
  dateRange: string;
};

const reports: ReportItem[] = [
  { id: "1", title: "Monthly Progress Report", name: "Shraddha Sawant", dateRange: "01 Jul - 31 Jul" },
  { id: "2", title: "Safety Inspection", name: "Sahil Gawade", dateRange: "05 Jul - 06 Jul" },
  { id: "3", title: "Material Usage Report", name: "Siddharth Chemate", dateRange: "10 Jul - 15 Jul" },
  { id: "4", title: "Expenses Report", name: "Shraddha Sawant", dateRange: "10 Jul - 15 Jul" },
  { id: "5", title: "Inventory Report", name: "Shraddha Sawant", dateRange: "10 Jul - 15 Jul" },
];

export default function ReportScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [popup, setpopup] = useState(false);
  const activepopup = () => setpopup(!popup);

  const renderReportItem = ({ item }: { item: ReportItem }) => (
    <TouchableOpacity
      style={[
        styles.reportItem,
        { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.reportContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.boxes01[0] },
          ]}
        >
          <Ionicons name="document-text-outline" size={24} color={theme.secondary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.reportTitle, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.reportName, { color: theme.icons }]}>{item.name}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color={theme.icons} />
          <Text style={[styles.dateText, { color: theme.icons }]}>{item.dateRange}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReportItem}
        contentContainerStyle={styles.listContainer}
      />



      <FloatingButtons activepopup={activepopup} text="Generate Report"/>
      {/* Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={popup}
        onRequestClose={() => setpopup(false)}
      >
        <BlurView
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0, 0, 0, 0.67)" } // black overlay with 50% opacity
          ]}
          tint={theme.isDark ? "dark" : "light"}
          intensity={20}
        />
        <View style={styles.overlay}>
          <Reportui fun={activepopup} />
        </View>
      </Modal>
      {/* Floating Button */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  reportItem: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
  },
  reportContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  reportName: {
    fontSize: 14,
    marginTop: 2,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
