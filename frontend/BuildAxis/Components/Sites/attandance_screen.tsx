import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // Icons

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
        <View style={[styles.card, { backgroundColor: "#E6F9EF" }]}>
          <Ionicons name="people-outline" size={32} color="#28A745" />
          <Text style={styles.cardTitle}>Present</Text>
          <Text style={styles.cardNumber}>155</Text>
        </View>

        {/* Absent */}
        <View style={[styles.card, { backgroundColor: "#FDECEC" }]}>
          <AntDesign name="user" size={32} color="#DC3545" />
          <Text style={styles.cardTitle}>Absent</Text>
          <Text style={styles.cardNumber}>10</Text>
        </View>

        {/* Half Day */}
        <View style={[styles.card, { backgroundColor: "#FFF8E6" }]}>
          <Ionicons name="time-outline" size={32} color="#D39E00" />
          <Text style={styles.cardTitle}>Half Day</Text>
          <Text style={styles.cardNumber}>155</Text>
        </View>

      </View>
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
