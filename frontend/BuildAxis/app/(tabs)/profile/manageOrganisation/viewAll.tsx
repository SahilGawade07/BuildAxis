import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../../context/ThemeContext";
import { PersonListItem } from "../../../../components/Profile/ManageOrganisation/PersonListItem";
import { getViewAllPeople } from "../../../../lib/api";
import HeaderBar from "../../../../components/ui/headerBar";

interface Person {
  _id: string;
  fName?: string;
  lName?: string;
  vendorName?: string;
  profilePic: string;
  role?: string;
  email?: string;
  phone?: string | number;
  work?: string;
  contactPerson?: string;
  phoneNo?: number;
  type: "user" | "labour" | "vendor";
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ViewAllScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { role, orgId } = params;

  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const getRoleTitle = () => {
    switch (role) {
      case "supervisor":
        return "Supervisors";
      case "promoter":
        return "Promoters";
      case "labour":
        return "Labours";
      case "vendor":
        return "Vendors";
      default:
        return "All People";
    }
  };

  const fetchPeople = async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getViewAllPeople(
        orgId as string,
        role as string,
        page
      );

      if (response.success) {
        const newPeople = response.data?.people || [];
        const paginationInfo = response.data?.pagination;

        if (isRefresh || page === 1) {
          setPeople(newPeople);
        } else {
          setPeople((prev) => [...prev, ...newPeople]);
        }

        setPagination(paginationInfo || null);
        setCurrentPage(page);
      } else {
        Alert.alert("Error", "Failed to fetch people");
      }
    } catch (error) {
      console.error("Error fetching people:", error);
      Alert.alert("Error", "Failed to fetch people. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (orgId && role) {
        fetchPeople(1);
      }
    }, [orgId, role])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPeople(1, true);
  };

  const handleLoadMore = () => {
    if (pagination?.hasNextPage && !loadingMore) {
      fetchPeople(currentPage + 1);
    }
  };

  /**
   * Navigate to the appropriate profile details page when a person is tapped
   * Routes to different pages based on person type (supervisor, promoter, labour, vendor)
   */
  const handlePersonPress = (person: Person) => {
    // Navigate to person details page based on type
    switch (person.type) {
      case "user":
        if (person.role === "supervisor") {
          router.push({
            pathname:
              "/profile/manageOrganisation/supervisorDetails/[supervisorId]",
            params: {
              supervisorId: person._id,
              name: `${person.fName} ${person.lName}`,
              profilePicUrl: person.profilePic,
            },
          });
        } else if (person.role === "promoter") {
          router.push({
            pathname: "/profile/manageOrganisation/ownerDetails/[ownerId]",
            params: {
              ownerId: person._id,
              name: `${person.fName} ${person.lName}`,
              profilePicUrl: person.profilePic,
            },
          });
        }
        break;
      case "labour":
        router.push({
          pathname: "/profile/manageOrganisation/labourDetails/[labourId]",
          params: {
            labourId: person._id,
            name: `${person.fName} ${person.lName}`,
            profilePicUrl: person.profilePic,
            work: person.work || "General Labour",
          },
        });
        break;
      case "vendor":
        router.push({
          pathname: "/profile/manageOrganisation/vendorDetails/[vendorId]",
          params: {
            vendorId: person._id,
            name: person.vendorName || "Vendor",
            profilePicUrl: person.profilePic,
          },
        });
        break;
      default:
        console.log("Unknown person type:", person.type);
    }
  };

  const renderPersonItem = ({ item }: { item: Person }) => (
    <PersonListItem person={item} onPress={() => handlePersonPress(item)} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading more...
        </Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.text }]}>
        No {getRoleTitle().toLowerCase()} found
      </Text>
      <Text style={[styles.emptySubText, { color: theme.icons }]}>
        There are no {getRoleTitle().toLowerCase()} in this organisation yet.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
        <HeaderBar title={getRoleTitle()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading {getRoleTitle().toLowerCase()}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <HeaderBar title={getRoleTitle()} />

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.listItemFill },
        ]}
      >
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search people..."
          placeholderTextColor={theme.icons}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* People List */}
      <FlatList
        data={people}
        renderItem={renderPersonItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Pagination Info */}
      {pagination && (
        <View
          style={[
            styles.paginationInfo,
            { backgroundColor: theme.listItemFill },
          ]}
        >
          <Text style={[styles.paginationText, { color: theme.text }]}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>
          <Text style={[styles.paginationText, { color: theme.icons }]}>
            {pagination.totalCount} total {getRoleTitle().toLowerCase()}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  paginationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  paginationText: {
    fontSize: 12,
  },
});
