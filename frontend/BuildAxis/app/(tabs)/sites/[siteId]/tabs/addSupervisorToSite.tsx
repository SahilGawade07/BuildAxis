import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import HeaderBar from "@/components/ui/headerBar";
import { getViewAllPeople, addSupervisorsToSite } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Supervisor {
  _id: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  profilePic?: string;
}

export default function AddSupervisorToSite() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const siteId = Array.isArray(params.siteId)
    ? params.siteId[0]
    : params.siteId;
  const siteName = Array.isArray(params.siteName)
    ? params.siteName[0]
    : params.siteName;

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([]);
  const [orgId, setOrgId] = useState<string>("");
  const [hasMorePages, setHasMorePages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);

      // Get orgId from storage
      const storedInfo = await AsyncStorage.getItem("organizationInfo");
      if (!storedInfo) {
        Alert.alert("Error", "Organization information not found");
        return;
      }

      const parsed = JSON.parse(storedInfo);
      const organizationId = parsed.orgId;
      setOrgId(organizationId);

      // Fetch all supervisors from all pages
      await fetchAllSupervisors(organizationId);
    } catch (error: any) {
      console.error("Error fetching supervisors:", error);
      Alert.alert("Error", "Failed to fetch supervisors");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSupervisors = async (organizationId: string) => {
    let allSupervisors: Supervisor[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await getViewAllPeople(
          organizationId,
          "supervisor",
          page
        );
        if (response.success && response.data) {
          const pageSupervisors = response.data.people || [];
          allSupervisors = [...allSupervisors, ...pageSupervisors];

          // Check if there are more pages
          hasMore = response.data.pagination.hasNextPage;
          page++;
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        hasMore = false;
      }
    }

    setSupervisors(allSupervisors);    
  };

  const toggleSupervisorSelection = (supervisorId: string) => {
    setSelectedSupervisors((prev) => {
      if (prev.includes(supervisorId)) {
        return prev.filter((id) => id !== supervisorId);
      } else {
        return [...prev, supervisorId];
      }
    });
  };

  const handleAddSupervisors = async () => {
    if (selectedSupervisors.length === 0) {
      Alert.alert("Error", "Please select at least one supervisor");
      return;
    }

    try {
      const response = await addSupervisorsToSite(
        siteId as string,
        selectedSupervisors,
        orgId
      );

      if (response.success) {
        Alert.alert(
          "Success",
          response.message ||
            `Added ${selectedSupervisors.length} supervisor(s) to the site`,
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate back to supervisor list
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to add supervisors to site"
        );
      }
    } catch (error: any) {
      console.error("Error adding supervisors to site:", error);
      Alert.alert(
        "Error",
        "Failed to add supervisors to site. Please try again."
      );
    }
  };

  const renderSupervisor = ({ item }: { item: Supervisor }) => {
    const isSelected = selectedSupervisors.includes(item._id);

    return (
      <TouchableOpacity
        style={[
          styles.supervisorCard,
          {
            backgroundColor: theme.card,
            borderColor: isSelected ? theme.primary : theme.listItemBorder,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => toggleSupervisorSelection(item._id)}
      >
        <View style={styles.supervisorInfo}>
          <Image
            source={{
              uri:
                item.profilePic ||
                "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
            }}
            style={styles.profilePic}
          />
          <View style={styles.supervisorDetails}>
            <Text style={[styles.supervisorName, { color: theme.text }]}>
              {item.fName} {item.lName}
            </Text>
            <Text style={[styles.supervisorEmail, { color: theme.muted }]}>
              {item.email}
            </Text>
            <Text style={[styles.supervisorPhone, { color: theme.muted }]}>
              {item.phone}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: isSelected ? theme.primary : "transparent",
              borderColor: isSelected ? theme.primary : theme.listItemBorder,
            },
          ]}
        >
          {isSelected && (
            <Text style={[styles.checkmark, { color: "white" }]}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <HeaderBar title="Add Supervisors" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading supervisors...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Add Supervisors" />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Select Supervisors to Add
        </Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Choose supervisors from your organization to add to this site
        </Text>

        {supervisors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No supervisors found in your organization
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.muted }]}>
              Add supervisors to your organization first
            </Text>
          </View>
        ) : (
          <FlatList
            data={supervisors}
            renderItem={renderSupervisor}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {supervisors.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor:
                  selectedSupervisors.length > 0 ? theme.primary : theme.muted,
              },
            ]}
            onPress={handleAddSupervisors}
            disabled={selectedSupervisors.length === 0}
          >
            <Text style={[styles.addButtonText, { color: "white" }]}>
              Add {selectedSupervisors.length} Supervisor
              {selectedSupervisors.length !== 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
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
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  supervisorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  supervisorInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  supervisorDetails: {
    flex: 1,
  },
  supervisorName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  supervisorEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  supervisorPhone: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
