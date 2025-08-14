import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // Icons
import Colors from "@/Thems/color"; // Make sure this exists

export default function AttendancaceBox({ backgroundColor,circle_color,Ionicons_name,Ionicons_color,Text1,text2}:any) {
  return (
            <View style={[styles.card, { backgroundColor:backgroundColor }]}>
          <View style={[styles.iconCircle, { backgroundColor: circle_color }]}>
            <Ionicons name={Ionicons_name} size={28} color={Ionicons_color} />
          </View>
          <Text style={styles.cardTitle}>{Text1}</Text>
          <Text style={styles.cardNumber}>{text2}</Text>
        </View>
  );
}

const styles = StyleSheet.create({

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