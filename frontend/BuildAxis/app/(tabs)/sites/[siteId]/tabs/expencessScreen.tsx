import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, RefreshControl } from "react-native";
import { Expencess } from "@/components/ui/expencesseBox";
import { useTheme } from "../../../../../context/ThemeContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Addbuttons } from "@/components/ui/addbutton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Addbuttonspage } from "@/components/ui/addbuttonforpage";
import { getSiteExpenses } from "@/lib/api";

export const ExpencessScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const siteId =
    typeof params.siteId === "string"
      ? params.siteId
      : Array.isArray(params.siteId)
      ? params.siteId[0]
      : undefined;

  // State for expenses data
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch expenses data
  const fetchExpenses = async (
    page: number = 1,
    isRefresh: boolean = false
  ) => {
    if (!siteId) {
      return;
    }

    try {
      setLoading(true);
      const response = await getSiteExpenses(siteId, page);

      if (response.success && response.data) {
        if (isRefresh || page === 1) {
          setExpenses(response.data.expenses || []);
        } else {
          setExpenses((prev) => [...prev, ...(response.data?.expenses || [])]);
        }

        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
        setHasMore(page < (response.data.totalPages || 1));
      }
    } catch (error) {
      // Silent error handling for production
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load expenses on component mount
  useEffect(() => {
    if (siteId) {
      fetchExpenses(1, true);
    }
  }, [siteId]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchExpenses(1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loading && hasMore && currentPage < totalPages) {
      fetchExpenses(currentPage + 1, false);
    }
  };

  // Render expense item
  const renderExpenseItem = ({ item }: { item: any }) => (
    <Expencess item={item} />
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome6 name="receipt" size={48} color={theme.muted} />
      <Text style={[styles.emptyText, { color: theme.muted }]}>
        No expenses found
      </Text>
      <Text style={[styles.emptySubText, { color: theme.muted }]}>
        Add your first expense to get started
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.listContainer,
          expenses.length === 0 && styles.emptyListContainer,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          loading && expenses.length > 0 ? (
            <View style={styles.loadingFooter}>
              <Text style={[styles.loadingText, { color: theme.muted }]}>
                Loading more expenses...
              </Text>
            </View>
          ) : null
        }
      />

      <Addbuttonspage
        iconname={<FontAwesome6 name="add" size={20} color="white" />}
        path={`/(tabs)/sites/${siteId}/tabs/screens/addexpenses`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 100, // Extra space for floating action button
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    opacity: 0.6,
  },
  loadingFooter: {
    paddingVertical: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
