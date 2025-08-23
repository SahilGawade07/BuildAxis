import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryBtn from "@/components/ui/primaryBtn";

interface OwnerData {
  _id: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  profilePic?: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
}

export default function OwnerDetails() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const ownerId = params.ownerId as string;
  const ownerName = params.name as string;
  const profilePicUrl = params.profilePicUrl as string;

  const [owner, setOwner] = useState<OwnerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ownerId) {
      fetchOwnerDetails();
    }
  }, [ownerId]);

  const fetchOwnerDetails = async () => {
    try {
      setLoading(true);
      // For now, we'll use the data passed via params
      // In a real app, you'd fetch from API using ownerId
      const mockOwner: OwnerData = {
        _id: ownerId,
        fName: ownerName?.split(" ")[0] || "Owner",
        lName: ownerName?.split(" ").slice(1).join(" ") || "",
        email: "owner@example.com", // This would come from API
        phone: "+1234567890", // This would come from API
        profilePic: profilePicUrl,
        orgId: "org123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setOwner(mockOwner);
    } catch (error) {
      console.error("Error fetching owner details:", error);
      Alert.alert("Error", "Failed to load owner details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditOwner = () => {
    // Navigate to edit owner page
    router.push({
      pathname: "/profile/manageOrganisation/editOwner",
      params: { ownerId, name: ownerName, profilePicUrl },
    });
  };

  const handleDeleteOwner = () => {
    Alert.alert(
      "Delete Owner",
      "Are you sure you want to delete this owner? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Handle delete logic here
            Alert.alert("Success", "Owner deleted successfully");
            router.back();
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <HeaderBar title="Owner Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!owner) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <HeaderBar title="Owner Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            Owner not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Owner Details" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View
          style={[styles.profileHeader, { backgroundColor: theme.secondary }]}
        >
          <View style={styles.profileImageContainer}>
            {owner.profilePic ? (
              <Image
                source={{ uri: owner.profilePic }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.defaultProfileImage,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Ionicons name="person" size={60} color={theme.text} />
              </View>
            )}
          </View>
          <Text style={[styles.ownerName, { color: theme.text }]}>
            {owner.fName} {owner.lName}
          </Text>
          <Text style={[styles.ownerRole, { color: theme.text }]}>
            Organisation Owner
          </Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Personal Information
          </Text>

          <View
            style={[styles.detailCard, { backgroundColor: theme.listItemFill }]}
          >
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Full Name
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {owner.fName} {owner.lName}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Email
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {owner.email}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Phone
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {owner.phone}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Joined
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {new Date(owner.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Actions
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={handleEditOwner}
            >
              <Ionicons name="create-outline" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>
                Edit Owner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.secondary },
              ]}
              onPress={() => {
                // Handle view organisation details
                Alert.alert(
                  "Info",
                  "View organisation details functionality coming soon"
                );
              }}
            >
              <Ionicons name="business-outline" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>
                View Organisation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#ef4444" }]}
              onPress={handleDeleteOwner}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text style={[styles.actionButtonText, { color: "white" }]}>
                Delete Owner
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <PrimaryBtn text="Back to Manage Organisation" onPress={handleBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  ownerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  ownerRole: {
    fontSize: 16,
    opacity: 0.8,
  },
  detailsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  detailCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButtons: {
    gap: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  backButtonContainer: {
    paddingHorizontal: 20,
  },
});
