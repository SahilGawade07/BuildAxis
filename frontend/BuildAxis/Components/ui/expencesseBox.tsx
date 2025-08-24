import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "expo-router";

export const Expencess = ({ item }: any) => {
  const { theme } = useTheme();
  const router = useRouter();

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format the amount
  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "fullyPaid":
        return "#10B981"; // Green
      case "partiallyPaid":
        return "#F59E0B"; // Yellow
      case "fullyUnpaid":
        return "#EF4444"; // Red
      default:
        return theme.primary;
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "fullyPaid":
        return "Paid";
      case "partiallyPaid":
        return "Partial";
      case "fullyUnpaid":
        return "Unpaid";
      default:
        return status;
    }
  };

  // Handle expense item click
  const handleExpensePress = () => {
    router.push(`/(tabs)/sites/${item.siteId}/tabs/screens/expense-details/${item._id}`);
  };

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.wrapper} onPress={handleExpensePress}>
      <View
        style={[
          styles.sitecard,
          {
            backgroundColor: theme.listItemFill,
            borderColor: theme.listItemBorder,
          },
        ]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          {/* Left side */}
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.imageBox,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <FontAwesome6
                name="money-bills"
                size={24}
                color={theme.primary}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.billName, { color: theme.text }]}>
                {item.description || "No Description"}
              </Text>
              <Text style={[styles.paidBy, { color: theme.muted }]}>
                Paid by: {item.paidBy?.fName} {item.paidBy?.lName}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { borderColor: theme.listItemBorder }]} />

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          {/* Amount */}
          <View style={styles.amountRow}>
            <Ionicons name="cash-outline" size={18} color={theme.primary} />
            <Text style={[styles.amountText, { color: theme.text }]}>
              {formatAmount(item.amount)}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={18} color={theme.icons} />
            <Text style={[styles.dateText, { color: theme.text }]}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { 
    marginHorizontal: 20, 
    marginBottom: 16,
    marginTop: 8,
  },

  // Card container
  sitecard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },

  // Header layout
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardHeaderLeft: { 
    flexDirection: "row", 
    alignItems: "flex-start",
    flex: 1,
  },

  // Avatar / Icon Box
  imageBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  // Status Badge
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: "700",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Divider
  divider: {
    borderTopWidth: 0.5,
    marginVertical: 16,
    opacity: 0.3,
  },

  // Footer layout
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },

  amountRow: { 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  amountText: { 
    marginLeft: 8, 
    fontSize: 15, 
    fontWeight: "700",
    color: '#2D3748',
  },

  dateRow: { 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dateText: { 
    marginLeft: 8, 
    fontSize: 13, 
    fontWeight: "600",
    color: '#4A5568',
  },

  // Typography
  billName: { 
    fontSize: 16, 
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 4,
  },
  paidBy: { 
    fontSize: 13, 
    opacity: 0.7,
    lineHeight: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
