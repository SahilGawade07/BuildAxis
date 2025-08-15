import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const SiteBox = ({ item }: any) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.sitecard,
        {
          backgroundColor: theme.listItemFill,
          borderColor: theme.listItemBorder,
        },
      ]}
      onPress={() => router.push(`/sites/${item.id}` as any)} 
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View
            style={[styles.imageBox, { backgroundColor: theme.boxes01[0] }]}
          >
            <Ionicons name="image-outline" size={28} color={theme.icons} />
          </View>
          <Text style={[styles.sitename, { color: theme.text }]}>
            {item.name}
          </Text>
        </View>

        <View
          style={[styles.activeBadge, { backgroundColor: theme.secondary }]}
        >
          <Text style={styles.activeText}>{item.status}</Text>
        </View>
      </View>

      <View style={[styles.cardFooter, { borderColor: theme.icons }]}>
        <View style={styles.progressRow}>
          <Ionicons name="radio-button-off" size={18} color={theme.primary} />
          <Text style={[styles.progressText, { color: theme.text }]}>
            {item.progress}
          </Text>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.text} />
          <Text style={[styles.dateText, { color: theme.text }]}>
            {item.date}
          </Text>
        </View>

        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Image placeholder box
  imageBox: {
    width: 50,
    height: 50,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Progress & date rows
  progressRow: { flexDirection: "row", alignItems: "center" },
  progressText: { marginLeft: 4, fontSize: 12 },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { marginLeft: 4, fontSize: 12 },

  // Project card styling
  sitecard: {
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },

  // Project name text
  sitename: { fontSize: 16, fontWeight: "500" },
});
