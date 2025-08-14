import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";

export  const Task_Box = ({ item }: any) => (
  
    <TouchableOpacity style={styles.sitecard} onPress={()=>{router.push("/task")}}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        {/* Left side: Project image placeholder + name */}
        <View style={styles.cardHeaderLeft}>
          <View style={styles.imageBox}>
            <Ionicons name="image-outline" size={28} color="#888" />
          </View>
          <View>
          <Text style={styles.sitename}>{item.name}</Text>
          <Text style={[styles.text,{fontSize:12}]}>Soham Darade</Text>
          </View>
        </View>

        {/* Right side: Active badge */}
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>{item.status}</Text>
        </View>
      </View>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        {/* Project progress */}
        <View style={styles.progressRow}>
          <Ionicons name="radio-button-off" size={18} color="#0057FF" />
          <Text style={styles.progressText}>{item.progress}</Text>
        </View>

        {/* Project date */}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color="#000" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>

        {/* Menu button */}
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={22} color="#000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({

  text: {
    fontSize: 18,
    color: "gray",
  },


  // Image placeholder box
  imageBox: {
    width: 50,
    height: 50,
    backgroundColor: "#EAEFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  // Card header styling
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center" },

  // Active status badge
  activeBadge: {
    backgroundColor: "#0057FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: "center",
  },
  activeText: { color: "#fff", fontSize: 12, fontWeight: "500" },

  // Card footer styling
  cardFooter: {
    borderTopWidth: 1.5,
    marginTop: 10,
    paddingTop: 10,
    borderColor: "#B2B2B2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Progress & date rows
  progressRow: { flexDirection: "row", alignItems: "center" },
  progressText: { marginLeft: 4, fontSize: 12, color: "#000" },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { marginLeft: 4, fontSize: 12, color: "#000" },

  // Project card styling
  sitecard: {
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.6,
    borderColor: "#D0D5DD",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },

  // Project name text
  sitename: { fontSize: 16, fontWeight: "500" },
});


