import React, { useState } from "react";
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
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryBtn from "@/components/ui/primaryBtn";
import { getVendorById } from "@/lib/api";

interface VendorData {
  _id: string;
  vendorName: string;
  contactPerson: string;
  phoneNo: string;
  address: string;
  services: string[];
  gstNumber?: string;
  orgId: string;
  orgName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VendorDetails() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const vendorId = params.vendorId as string;
  const vendorName = params.name as string;
  const profilePicUrl = params.profilePicUrl as string;

  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (vendorId) {
        fetchVendorDetails();
      }
    }, [vendorId])
  );

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);

      // Fetch real vendor data from API
      const response = await getVendorById(vendorId);

      if (response.success && response.data) {
        setVendor(response.data);
      } else {
        // Fallback to params data if API fails
        const fallbackVendor: VendorData = {
          _id: vendorId,
          vendorName: vendorName || "Vendor",
          contactPerson: "Contact Person", // This would come from API
          phoneNo: "+1234567890", // This would come from API
          address: "Vendor Address", // This would come from API
          services: ["Service 1", "Service 2"], // This would come from API
          gstNumber: "GST123456789", // This would come from API
          orgId: "org123",
          orgName: "Unknown Organization",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setVendor(fallbackVendor);

        if (!response.success) {
          console.warn("API returned error:", response.message);
        }
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);

      // Fallback to params data on error
      const fallbackVendor: VendorData = {
        _id: vendorId,
        vendorName: vendorName || "Vendor",
        contactPerson: "Contact Person",
        phoneNo: "+1234567890",
        address: "Vendor Address",
        services: ["Service 1", "Service 2"],
        gstNumber: "GST123456789",
        orgId: "org123",
        orgName: "Unknown Organization",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVendor(fallbackVendor);

      Alert.alert("Warning", "Using cached data due to network error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditVendor = () => {
    // Navigate to edit vendor page with current vendor data
    router.push({
      pathname: "/profile/manageOrganisation/editVendor",
      params: {
        vendorId,
        name: vendor?.vendorName || vendorName,
        contactPerson: vendor?.contactPerson || "",
        phoneNo: vendor?.phoneNo || "",
        address: vendor?.address || "",
        services: vendor?.services?.join(",") || "",
        gstNumber: vendor?.gstNumber || "",
      },
    });
  };

  const handleDeleteVendor = () => {
    Alert.alert(
      "Delete Vendor",
      "Are you sure you want to delete this vendor? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Handle delete logic here
            Alert.alert("Success", "Vendor deleted successfully");
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
        <HeaderBar title="Vendor Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!vendor) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <HeaderBar title="Vendor Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            Vendor not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Vendor Details" />

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
            {profilePicUrl ? (
              <Image
                source={{ uri: profilePicUrl }}
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
                <Ionicons name="business" size={60} color={theme.text} />
              </View>
            )}
          </View>
          <Text style={[styles.vendorName, { color: theme.text }]}>
            {vendor.vendorName}
          </Text>
          <Text style={[styles.vendorRole, { color: theme.text }]}>Vendor</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Company Information
          </Text>

          <View
            style={[styles.detailCard, { backgroundColor: theme.listItemFill }]}
          >
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Company Name
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {vendor.vendorName}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Contact Person
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {vendor.contactPerson}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Phone
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {vendor.phoneNo}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Address
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {vendor.address}
              </Text>
            </View>

            {vendor.gstNumber && (
              <View style={styles.detailRow}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={theme.icons}
                />
                <Text style={[styles.detailLabel, { color: theme.text }]}>
                  GST Number
                </Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {vendor.gstNumber}
                </Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Joined
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {new Date(vendor.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>
                Organization
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {vendor.orgName || "Unknown"}
              </Text>
            </View>
          </View>
        </View>

        {/* Services Section */}
        {vendor.services && vendor.services.length > 0 && (
          <View style={styles.servicesSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Services Offered
            </Text>
            <View
              style={[
                styles.servicesCard,
                { backgroundColor: theme.listItemFill },
              ]}
            >
              {vendor.services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={theme.primary}
                  />
                  <Text style={[styles.serviceText, { color: theme.text }]}>
                    {service}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Actions
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={handleEditVendor}
            >
              <Ionicons name="create-outline" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>
                Edit Vendor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.secondary },
              ]}
              onPress={() => {
                // Handle view projects/contracts
                Alert.alert("Info", "View projects functionality coming soon");
              }}
            >
              <Ionicons name="list-outline" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>
                View Projects
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#ef4444" }]}
              onPress={handleDeleteVendor}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text style={[styles.actionButtonText, { color: "white" }]}>
                Delete Vendor
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
  vendorName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  vendorRole: {
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
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  servicesCard: {
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
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: "500",
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
