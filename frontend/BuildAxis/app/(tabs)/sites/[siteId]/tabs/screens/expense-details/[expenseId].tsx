import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "../../../../../../../context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { getExpenseById } from "@/lib/api";

export default function ExpenseDetailsScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const router = useRouter();
  const expenseId = params.expenseId as string;
  const siteId = params.siteId as string;

  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (expenseId) {
      fetchExpenseDetails();
    }
  }, [expenseId]);

  const fetchExpenseDetails = async () => {
    try {
      setLoading(true);
      const response = await getExpenseById(expenseId);
      
      if (response.success && response.data) {
        setExpense(response.data);
      } else {
        Alert.alert("Error", response.message || "Failed to fetch expense details");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch expense details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fullyPaid":
        return "#10B981";
      case "partiallyPaid":
        return "#F59E0B";
      case "fullyUnpaid":
        return "#EF4444";
      default:
        return theme.primary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "fullyPaid":
        return "Fully Paid";
      case "partiallyPaid":
        return "Partially Paid";
      case "fullyUnpaid":
        return "Unpaid";
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "inventory":
        return "box";
      case "tool":
        return "wrench";
      case "labor":
        return "users";
      case "transport":
        return "truck";
      case "other":
        return "receipt";
      default:
        return "receipt";
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading expense details...
        </Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <FontAwesome6 name="exclamation-triangle" size={48} color={theme.muted} />
        <Text style={[styles.errorText, { color: theme.text }]}>
          Expense not found
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Expense Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(expense.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(expense.status) },
              ]}
            >
              {getStatusText(expense.status)}
            </Text>
          </View>
        </View>

        {/* Main Info Card */}
        <View style={[styles.mainCard, { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder }]}>
          {/* Category and Amount */}
          <View style={styles.categoryRow}>
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <FontAwesome6
                name={getCategoryIcon(expense.category)}
                size={24}
                color={theme.primary}
              />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryText, { color: theme.muted }]}>
                {expense.category?.charAt(0).toUpperCase() + expense.category?.slice(1)}
              </Text>
              <Text style={[styles.amountText, { color: theme.text }]}>
                {formatAmount(expense.amount)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={[styles.descriptionLabel, { color: theme.muted }]}>
              Description
            </Text>
            <Text style={[styles.descriptionText, { color: theme.text }]}>
              {expense.description || "No description provided"}
            </Text>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentMethodContainer}>
            <Text style={[styles.paymentMethodLabel, { color: theme.muted }]}>
              Payment Method
            </Text>
            <Text style={[styles.paymentMethodText, { color: theme.text }]}>
              {expense.paymentMethod?.charAt(0).toUpperCase() + expense.paymentMethod?.slice(1)}
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Details</Text>
          
          {/* Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: theme.muted }]}>Date</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {formatDate(expense.date)}
              </Text>
            </View>
          </View>

          {/* Paid By */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="person-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: theme.muted }]}>Paid By</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {expense.paidBy?.fName} {expense.paidBy?.lName}
              </Text>
            </View>
          </View>

          {/* Site */}
          {expense.siteId && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="location-outline" size={20} color={theme.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Site</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {expense.siteId.name}
                </Text>
              </View>
            </View>
          )}

          {/* Vendor */}
          {expense.vendorId && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="business-outline" size={20} color={theme.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Vendor</Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {expense.vendorId.vendorName}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Receipts Card */}
        {expense.receipts && expense.receipts.length > 0 && (
          <View style={[styles.receiptsCard, { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Receipts</Text>
            <View style={styles.receiptsGrid}>
              {expense.receipts.map((receipt: string, index: number) => (
                <TouchableOpacity key={index} style={styles.receiptItem}>
                  <Image source={{ uri: receipt }} style={styles.receiptImage} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Notes Card */}
        {expense.notes && (
          <View style={[styles.notesCard, { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Notes</Text>
            <Text style={[styles.notesText, { color: theme.text }]}>
              {expense.notes}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  statusBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mainCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  amountText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3748",
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentMethodLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  paymentMethodText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  detailsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  receiptsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  receiptsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  receiptItem: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
  },
  receiptImage: {
    width: "100%",
    height: "100%",
  },
  notesCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
});
