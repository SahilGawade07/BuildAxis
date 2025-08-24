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
        { backgroundColor: theme.listItemFill, borderColor: "#ffffff" },
      ]}
      onPress={() =>
        router.push({
          pathname: `/sites/[siteId]` as any,
          params: { siteId: item.id, siteName: item.name },
        })
      }
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View
            style={[styles.imageBox, { backgroundColor: theme.boxes01[0] }]}
          >
            <Ionicons name="home-outline" size={28} color={theme.icons} />
          </View>
          <View>
            <Text style={[styles.sitename, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={{ fontSize: 12, color: theme.icons }}>
              {item.customerName}
            </Text>
          </View>
        </View>

        {/* Status badge */}
        <View
          style={[
            styles.activeBadge,
            {
              backgroundColor:
                item.status === "active" ? theme.secondary : theme.icons,
            },
          ]}
        >
          <Text style={styles.activeText}>{item.status}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.cardFooter, { borderColor: theme.icons }]}>
        {/* ✅ Budget pill */}
        <View
          style={[styles.budgetTag, { backgroundColor: theme.primary + "22" }]}
        >
          <Ionicons name="cash-outline" size={14} color={theme.primary} />
          <Text style={[styles.budgetText, { color: theme.primary }]}>
            ₹{item.bugets}
          </Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.text} />
          <Text style={[styles.dateText, { color: theme.text }]}>
            {new Date(item.startDate).toLocaleDateString()}
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
  imageBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center" },

  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: "center",
  },
  activeText: { color: "#fff", fontSize: 12, fontWeight: "500" },

  cardFooter: {
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { marginLeft: 4, fontSize: 12 },

  sitecard: {
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  sitename: { fontSize: 16, fontWeight: "600" },

  budgetTag: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  budgetText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
  },
});
