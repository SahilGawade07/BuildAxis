import { CompanyBar } from "@/components/ui/companyBar";
import { SiteBox } from "@/components/Sites/siteBox";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import { getSites } from "@/lib/api";
import { Sites } from "@/types/sites";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Site() {
  const router = useRouter();
  const { theme } = useTheme();

  const [sites, setSites] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchSites = useCallback(async () => {
    try {
      setError("");

      const storedInfo = await AsyncStorage.getItem("organizationInfo");

      if (!storedInfo) {
        setError("No organization information found. Please login again.");
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(storedInfo);

      if (!parsed?.orgId) {
        setError("Invalid organization data. Please login again.");
        setLoading(false);
        return;
      }

      const id = parsed.orgId;

      const data = await getSites(id);
      setSites(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch sites");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSites();
    setRefreshing(false);
  }, [fetchSites]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSites();
    }, [fetchSites])
  );

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            Loading sites...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.icons} />
          <Text style={[styles.emptyText, { color: theme.text }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={fetchSites}
          >
            <Text style={[styles.retryButtonText, { color: "white" }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (sites.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="home-outline" size={48} color={theme.icons} />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No sites found
          </Text>
          <Text style={[styles.emptySubText, { color: theme.icons }]}>
            Create your first site to get started
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.backgroundgrey }]}
    >
      <StatusBar
        backgroundColor={theme.primary}
        barStyle={theme.isDark ? "light-content" : "dark-content"}
      />
      <CompanyBar />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Projects</Text>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.listItemFill,
            borderColor: theme.listItemBorder,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={theme.icons}
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search"
          style={[styles.searchInput, { color: theme.text }]}
          placeholderTextColor={theme.icons}
        />
      </View>

      <FlatList
        data={sites}
        renderItem={({ item }) => <SiteBox item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          sites.length === 0 ? styles.emptyListContainer : { paddingBottom: 20 }
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.secondary }]}
        onPress={() => router.push("/sites/addSite")}
      >
        <FontAwesome6 name="add" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginHorizontal: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 27,
    borderWidth: 1,
    paddingVertical: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  fab: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    right: 20,
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
});
