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
import { getViewAllPeople } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface Labour {
  _id: string;
  fName: string;
  lName: string;
  phone: string;
  profilePic?: string;
}

export default function SelectLabours() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const siteId = Array.isArray(params.siteId)
    ? params.siteId[0]
    : params.siteId;
  const siteName = Array.isArray(params.siteName)
    ? params.siteName[0]
    : params.siteName;

  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLabours, setSelectedLabours] = useState<string[]>([]);
  const [orgId, setOrgId] = useState<string>("");

  useEffect(() => {
    fetchLabours();
  }, []);

  const fetchLabours = async () => {
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

      // Fetch all labours from all pages
      await fetchAllLabours(organizationId);
    } catch (error: any) {
      console.error("Error fetching labours:", error);
      Alert.alert("Error", "Failed to fetch labours");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLabours = async (organizationId: string) => {
    let allLabours: Labour[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await getViewAllPeople(organizationId, "labour", page);
        if (response.success && response.data) {
          const pageLabours = response.data.people || [];
          allLabours = [...allLabours, ...pageLabours];

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

    setLabours(allLabours);
  };

  const toggleLabourSelection = (labourId: string) => {
    setSelectedLabours((prev) => {
      if (prev.includes(labourId)) {
        return prev.filter((id) => id !== labourId);
      } else {
        return [...prev, labourId];
      }
    });
  };

  const handleConfirmSelection = async () => {
    if (selectedLabours.length === 0) {
      Alert.alert("Error", "Please select at least one labour");
      return;
    }

    try {
      // Store selected labours in AsyncStorage for the createTask page to read
      await AsyncStorage.setItem(
        "tempSelectedLabours",
        JSON.stringify(selectedLabours)
      );

      // Navigate back to createTask
      router.back();
    } catch (error) {
      console.error("Error storing selected labours:", error);
      Alert.alert("Error", "Failed to save selection");
    }
  };

  const renderLabour = ({ item }: { item: Labour }) => {
    const isSelected = selectedLabours.includes(item._id);

    return (
      <TouchableOpacity
        style={[
          styles.labourCard,
          {
            backgroundColor: theme.card,
            borderColor: isSelected ? theme.primary : theme.listItemBorder,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => toggleLabourSelection(item._id)}
      >
        <View style={styles.labourInfo}>
          {item.profilePic ? (
            <Image
              source={{ uri: item.profilePic }}
              style={styles.profilePic}
            />
          ) : (
            <View
              style={[
                styles.profilePlaceholder,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={styles.profilePlaceholderText}>
                {item.fName.charAt(0)}
                {item.lName.charAt(0)}
              </Text>
            </View>
          )}
          <View style={styles.labourDetails}>
            <Text style={[styles.labourName, { color: theme.text }]}>
              {item.fName} {item.lName}
            </Text>
            <Text style={[styles.labourPhone, { color: theme.muted }]}>
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
        <HeaderBar title="Select Labours" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading labours...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Select Labours" />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Select Labours for Task
        </Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Choose labours from your organization to assign to this task
        </Text>

        {labours.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No labours found in your organization
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.muted }]}>
              Add labours to your organization first
            </Text>
          </View>
        ) : (
          <FlatList
            data={labours}
            renderItem={renderLabour}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {labours.length > 0 && (
        <View style={[styles.footer, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              {
                backgroundColor:
                  selectedLabours.length > 0 ? theme.primary : theme.muted,
              },
            ]}
            onPress={handleConfirmSelection}
            disabled={selectedLabours.length === 0}
          >
            <Text style={[styles.confirmButtonText, { color: "white" }]}>
              Confirm Selection ({selectedLabours.length})
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
  labourCard: {
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
  labourInfo: {
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
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePlaceholderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  labourDetails: {
    flex: 1,
  },
  labourName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  labourPhone: {
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
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
