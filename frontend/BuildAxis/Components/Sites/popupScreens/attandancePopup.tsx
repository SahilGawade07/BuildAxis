import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Topbar from "@/components/Sites/popupScreens/common/topBar";
import { useTheme } from "../../../context/ThemeContext"; // adjust path

export default function AttendanceModal({ fun }: any) {
  const { theme } = useTheme(); // <-- use theme here
  const [attendance, setAttendance] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const data = [
    { id: "1", name: "Shraddha Swant" },
    { id: "2", name: "Shraddha Swant" },
    { id: "3", name: "Shraddha Swant" },
    { id: "4", name: "Shraddha Swant" },
    { id: "5", name: "Shraddha Swant" },
  ];

  const toggleAttendance = (index: number) => {
    const updated = [...attendance];
    updated[index] = !updated[index];
    setAttendance(updated);
  };

  return (
    <View style={[styles.modal, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Topbar text="Mark Attendance" funs={fun} />

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isChecked = attendance[index];
          return (
            <TouchableOpacity
              style={[
                styles.row,
                {
                  backgroundColor: isChecked
                    ? theme.primary
                    : theme.backgroundgrey,
                },
              ]}
              onPress={() => toggleAttendance(index)}
            >
              <Image
                source={{ uri: "https://via.placeholder.com/30" }}
                style={styles.avatar}
              />
              <Text style={[styles.name, { color: theme.text }]}>
                {item.name}
              </Text>
              <View
                style={[
                  styles.checkbox,
                  isChecked && {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
              >
                {isChecked && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
        style={{ maxHeight: 500 }}
        showsVerticalScrollIndicator={true}
      />

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          Update Attendance
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
    padding: 10,
    width: "95%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
  },
});
