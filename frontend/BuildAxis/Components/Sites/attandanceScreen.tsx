import React from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // Icons
import Colors from "@/Thems/color"; // Make sure this exists
import AttendancaceBox from "@/Components/Common/attandanceBox"
import Submit_bbutt from "../Common/SubmitBtn";
import LabourList from "../Common/labourList";
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
export default function AttendanceSummary() {
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
      
                    <FlatList
                data={data}
                renderItem={LabourList}
                keyExtractor={(item) => item.id}
              />
      <Submit_bbutt text="Mark Attandance" />

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
});
