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
import { Colors } from "@/Thems/color"; // Make sure this exists
import AttendancaceBox from "@/components/ui/attandanceBox";
import Submit_bbutt from "../../../../../components/ui/SubmitBtn";
import LabourList from "../../../../../components/ui/labourList";
import { BlurView } from "expo-blur";
import AttendanceModal from "@/components/Sites/popupScreens/attandancePopup";
const data = [
  { id: "1", name: "Shraddha Swant" },
  { id: "2", name: "Shraddha Swant" },
  { id: "3", name: "Shraddha Swant" },
  { id: "4", name: "Shraddha Swant" },
  { id: "1", name: "Shraddha Swant" },
  { id: "2", name: "Shraddha Swant" },
  { id: "3", name: "Shraddha Swant" },
  { id: "4", name: "Shraddha Swant" },
  { id: "1", name: "Shraddha Swant" },
  { id: "2", name: "Shraddha Swant" },
  { id: "3", name: "Shraddha Swant" },
  { id: "4", name: "Shraddha Swant" },
];

// const [active, setActive] = useState("Present");

export default function AttendanceSummary() {
  const [active, setActive] = useState("Present");

  const [popup, setpopup] = useState(false);

  const activepopup = () => {
    const update = !popup;
    setpopup(update);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Date */}
      <Text style={styles.date}>Wed 31 Jul</Text>

      {/* Title */}
      <Text style={styles.title}>Attendance Summary</Text>

      {/* Cards Row */}
      <View style={styles.cardContainer}>
        {/* Present */}
        <AttendancaceBox
          backgroundColor={Colors.boxes02[0]}
          circle_color={Colors.boxes02[1]}
          Ionicons_name="people-outline"
          Ionicons_color={Colors.boxes02[2]}
          Text1="Present"
          text2="155"
        />
        {/* Absent */}
        <AttendancaceBox
          backgroundColor={Colors.boxes04[0]}
          circle_color={Colors.boxes04[1]}
          Ionicons_name="people-outline"
          Ionicons_color={Colors.boxes04[2]}
          Text1="Absent"
          text2="05"
        />
        {/* Half Day */}
        <AttendancaceBox
          backgroundColor={Colors.boxes03[0]}
          circle_color={Colors.boxes03[1]}
          Ionicons_name="time-outline"
          Ionicons_color={Colors.boxes03[2]}
          Text1="Half Day"
          text2="155"
        />
      </View>

      <View style={{ flexDirection: "row" }}>
        {["Present", "Absent"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActive(item)}
            style={styles.menuItem}
          >
            <Text style={[styles.text, active === item && styles.activeText1]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        renderItem={LabourList}
        keyExtractor={(item) => item.id}
      />

      <Submit_bbutt text="Mark Attandance" funcations={activepopup} />
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
          tint="light" // "light", "dark", "xlight"
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
    backgroundColor: "#fff",
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: "#555",
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
  card: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  iconCircle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: "500",
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  text: {
    fontSize: 18,
    color: "gray",
  },
  activeText1: {
    color: "#000000ff",
    textDecorationLine: "underline",
    textDecorationColor: "#1976D2",
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
