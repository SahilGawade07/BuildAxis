import React from "react";
import {
  View,Text,Image,StyleSheet,TouchableOpacity,StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {CompanyBar} from "@/Components/Common/company_bar"
import {Overview} from "@/Components/Common/summary_4box"
import { Safe_area } from "@/Components/Common/safe_area";

export default function Home() {
  return (
    <View style={styles.container}>
      <Safe_area/>
      <CompanyBar/>
      {/* Date Row */}
      <View style={styles.dateRow}>
        <Text style={styles.todayText}>Today</Text>
        <View style={styles.dateBox}>
          <Ionicons name="calendar-outline" size={16} color="#000" />
          <Text style={styles.dateText}>12/09/2025</Text>
        </View>
      </View>

      {/* Grid Cards */}
      <View style={styles.grid}>
        <Overview backgroundColor="#DBEDFD" circle_color="#B6DEFF" Ionicons_name="people" Ionicons_color="#4682B4" Text1="Attendance" text2="Supervisor: 20" text3="Labours: 100"/>
        <Overview backgroundColor="#F0FDF4" circle_color="#DCFCE7" Ionicons_name="cash-outline" Ionicons_color="#27AE60" Text1="Daily Expensces" text2="10000 Rs" text3=""/>
        <Overview backgroundColor="#FEFCE8" circle_color="#FEF9C3" Ionicons_name="cube-outline" Ionicons_color="#D4AC0D" Text1="Inventory" text2="Crush sand is required." text3="Bricks are required."/>
        <Overview backgroundColor="#FEF2F2" circle_color="#FEE2E2" Ionicons_name="construct-outline" Ionicons_color="#C0392B" Text1="Sites" text2="Active: 7" text3="Inactive: 4"/>
        </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
    // paddingHorizontal: 16,
  },
  header: {
    backgroundColor: "#002C62",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 12,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    paddingHorizontal:15
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
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding:15,
  },
  card: {
    width: "45%",
    height:200,
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems:"center",
    
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 8,
  },
  circle:{
    width:80,
    height:80,
    borderRadius:50,
    backgroundColor:"#B6DEFF",
    justifyContent:"center",
    alignItems:"center"
  }
});


