import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import AttendancaceBox from "@/components/ui/attandanceBox";
import Submit_bbutt from "../../../../../components/ui/SubmitBtn";
import LabourList from "../../../../../components/ui/labourList";
import { BlurView } from "expo-blur";
import AttendanceModal from "@/components/Sites/popupScreens/attandancePopup";
import { useTheme } from "../../../../../context/ThemeContext"; // ✅ Use theme

const data = [
  { id: "1", name: "Shraddha Sawant" },
  { id: "2", name: "Shraddha Sawant" },
  { id: "3", name: "Shraddha Sawant" },
  { id: "4", name: "Shraddha Sawant" },
];

export default function AttendanceSummary() {
  const [active, setActive] = useState("Present");
  const [popup, setpopup] = useState(false);

  const { theme } = useTheme(); // ✅ Get theme colors

  const activepopup = () => setpopup(!popup);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Date */}
      <Text style={[styles.date, { color: theme.text }]}>Wed 31 Jul</Text>

      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>
        Attendance Summary
      </Text>

      {/* Cards Row */}
      <View style={styles.cardContainer}>
        <AttendancaceBox
          backgroundColor={theme.boxes02[0]}
          circle_color={theme.boxes02[1]}
          Ionicons_name="people-outline"
          Ionicons_color={theme.boxes02[2]}
          Text1="Present"
          text2="155"
        />
        <AttendancaceBox
          backgroundColor={theme.boxes04[0]}
          circle_color={theme.boxes04[1]}
          Ionicons_name="people-outline"
          Ionicons_color={theme.boxes04[2]}
          Text1="Absent"
          text2="05"
        />
        <AttendancaceBox
          backgroundColor={theme.boxes03[0]}
          circle_color={theme.boxes03[1]}
          Ionicons_name="time-outline"
          Ionicons_color={theme.boxes03[2]}
          Text1="Half Day"
          text2="155"
        />
      </View>

      {/* Toggle Tabs */}
      <View style={{ flexDirection: "row" }}>
        {["Present", "Absent"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActive(item)}
            style={styles.menuItem}
          >
            <Text
              style={[
                styles.text,
                { color: theme.text },
                active === item && {
                  color: theme.secondary,
                  textDecorationLine: "underline",
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Labour List */}
      <FlatList
        data={data}
        renderItem={({ item }) => <LabourList item={item} />}
        keyExtractor={(item) => item.id}
      />

      {/* Submit Button */}
      <Submit_bbutt text="Mark Attandance" funcations={activepopup} />

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
            { backgroundColor: "rgba(65, 65, 65, 0.84)" },
          ]}
          tint={theme.isDark ? "dark" : "light"} // ✅ Adapt blur tint
          intensity={20}
        />
        <View style={styles.overlay}>
          <AttendanceModal fun={activepopup} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  text: {
    fontSize: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
