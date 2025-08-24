import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  RefreshControl,
  ActivityIndicator,
  View,
  Modal,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { CompanyInfoCard } from "@/components/Profile/ManageOrganisation/companyInfo";
import ProfilesRow from "@/components/Profile/ManageOrganisation/profilesRow";
import AddSupervisorPopup from "@/components/Profile/ManageOrganisation/addSupervisorPopup";
import AddLabourPopup from "@/components/Profile/ManageOrganisation/addLabourPopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getManageOrgPageData, getUserProfile } from "@/lib/api";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function ManageOrganization() {
  const { theme } = useTheme();

  const [orgName, setOrgName] = useState<string>("");
  const [orgAddress, setOrgAddress] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [promoters, setPromoters] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [labours, setLabours] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showAddSupervisorPopup, setShowAddSupervisorPopup] =
    useState<boolean>(false);
  const [showAddLabourPopup, setShowAddLabourPopup] = useState<boolean>(false);
  const [hasShownSupervisorAlert, setHasShownSupervisorAlert] =
    useState<boolean>(false);
  const [orgId, setOrgId] = useState<string>("");
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchData = async (
    showRefreshIndicator = false,
    forceRefresh = false
  ) => {
    try {
      // Skip fetch if data is fresh (less than 30 seconds old) and not forced
      const now = Date.now();
      if (!forceRefresh && now - lastFetchTime < 30000) {
        return;
      }

      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Try to prefill org card from storage
      try {
        const storedInfo = await AsyncStorage.getItem("organizationInfo");
        if (storedInfo) {
          const parsed = JSON.parse(storedInfo);
          if (parsed?.orgName) setOrgName(parsed.orgName);
          if (parsed?.address) setOrgAddress(parsed.address);
          if (parsed?.logoUrl) setLogoUrl(parsed.logoUrl);
        }
      } catch {}

      // 1) Try to get orgId from profile
      let resolvedOrgId: string | null = null;
      try {
        const profile = await getUserProfile();
        resolvedOrgId = profile?.data?.orgId || null;
      } catch {}

      // 2) Fallback to stored organizationInfo
      if (!resolvedOrgId) {
        const stored = await AsyncStorage.getItem("organizationInfo");
        if (stored) {
          const parsed = JSON.parse(stored);
          resolvedOrgId = parsed?.orgId || null;
        }
      }

      if (!resolvedOrgId) {
        throw new Error("No organisation found for this user");
      }

      // Store orgId for navigation
      setOrgId(resolvedOrgId);

      // Fetch manage-organisation page data
      const result = await getManageOrgPageData(resolvedOrgId);
      if (!result.success) {
        throw new Error(result.message || "Failed to load organisation data");
      }

      const data = result.data || {
        promoters: [],
        supervisors: [],
        labours: [],
        vendors: [],
      };
      setPromoters(Array.isArray(data.promoters) ? data.promoters : []);
      setSupervisors(Array.isArray(data.supervisors) ? data.supervisors : []);
      setLabours(Array.isArray(data.labours) ? data.labours : []);
      setVendors(Array.isArray(data.vendors) ? data.vendors : []);

      // Optionally try to pull org card from storage if still empty
      if (!orgName || !orgAddress) {
        const stored = await AsyncStorage.getItem("organizationInfo");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!orgName) setOrgName(parsed?.orgName || "");
          if (!orgAddress) setOrgAddress(parsed?.address || "");
        }
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Unable to load organisation data");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastFetchTime(Date.now()); // Update last fetch time
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh data when page comes into focus (e.g., returning from edit page)
  useFocusEffect(
    React.useCallback(() => {
      // Force refresh when returning to ensure we have the latest data
      fetchData(false, true);
    }, [])
  );

  // Show brief loading when refreshing on focus
  const [refreshingOnFocus, setRefreshingOnFocus] = useState(false);

  // Enhanced fetchData with focus refresh handling
  const fetchDataOnFocus = async () => {
    setRefreshingOnFocus(true);
    await fetchData(false, true);
    setRefreshingOnFocus(false);
  };

  // Update useFocusEffect to use the enhanced function
  useFocusEffect(
    React.useCallback(() => {
      fetchDataOnFocus();
    }, [])
  );

  // If no supervisors are found, prompt user to create one and navigate on OK
  useEffect(() => {
    if (!loading && !hasShownSupervisorAlert && supervisors.length === 0) {
      setHasShownSupervisorAlert(true);
      Alert.alert(
        "No supervisors found",
        "You don't have any supervisors yet. Would you like to create one now?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () =>
              router.push("/profile/manageOrganisation/createSupervisor"),
          },
        ]
      );
    }
  }, [loading, supervisors, hasShownSupervisorAlert]);

  const onRefresh = () => {
    fetchData(true);
  };

  // Navigation functions for View All buttons
  const handleViewAllSupervisors = () => {
    if (orgId) {
      router.push({
        pathname: "/profile/manageOrganisation/viewAll",
        params: { role: "supervisor", orgId },
      });
    }
  };

  const handleViewAllPromoters = () => {
    if (orgId) {
      router.push({
        pathname: "/profile/manageOrganisation/viewAll",
        params: { role: "promoter", orgId },
      });
    }
  };

  const handleViewAllLabours = () => {
    if (orgId) {
      router.push({
        pathname: "/profile/manageOrganisation/viewAll",
        params: { role: "labour", orgId },
      });
    }
  };

  const handleViewAllVendors = () => {
    if (orgId) {
      router.push({
        pathname: "/profile/manageOrganisation/viewAll",
        params: { role: "vendor", orgId },
      });
    }
  };

  // Function for adding new labour
  const handleAddNewLabour = () => {
    setShowAddLabourPopup(true);
  };

  // Function for adding new vendor
  const handleAddNewVendor = () => {
    router.push("/profile/manageOrganisation/createVendor");
  };

  // Function for handling supervisor profile press
  const handleSupervisorPress = (profile: any, index: number) => {
    const supervisor = profile.data;
    const supervisorName =
      [supervisor.fName, supervisor.lName].filter(Boolean).join(" ") ||
      "Supervisor";
    router.push({
      pathname: "/profile/manageOrganisation/supervisorDetails/[supervisorId]",
      params: {
        supervisorId: supervisor._id,
        name: supervisorName,
        profilePicUrl: supervisor.profilePic || "",
      },
    });
  };

  // Function for handling labour profile press
  const handleLabourPress = (profile: any, index: number) => {
    const labour = profile.data;
    const labourName =
      [labour.fName, labour.lName].filter(Boolean).join(" ") ||
      labour.work ||
      "Labour";
    router.push({
      pathname: "/profile/manageOrganisation/labourDetails/[labourId]",
      params: {
        labourId: labour._id,
        name: labourName,
        profilePicUrl: labour.profilePic || "",
        work: labour.work || "",
      },
    });
  };

  // Function for handling vendor profile press
  const handleVendorPress = (profile: any, index: number) => {
    const vendor = profile.data;
    router.push({
      pathname: "/profile/manageOrganisation/vendorDetails/[vendorId]",
      params: {
        vendorId: vendor._id,
        name: vendor.vendorName || "Vendor",
        profilePicUrl: vendor.profilePic || "",
      },
    });
  };

  // Function for handling owner profile press
  const handleOwnerPress = (profile: any, index: number) => {
    const owner = profile.data;
    const ownerName =
      [owner.fName, owner.lName].filter(Boolean).join(" ") || "Owner";
    router.push({
      pathname: "/profile/manageOrganisation/ownerDetails/[ownerId]",
      params: {
        ownerId: owner._id,
        name: ownerName,
        profilePicUrl: owner.profilePic || "",
      },
    });
  };

  // Map API entities to ProfilesRow structure
  const ownerProfiles = useMemo(
    () =>
      promoters.map((p: any) => ({
        name: [p?.fName, p?.lName].filter(Boolean).join(" ") || "Owner",
        imgUrl: p?.profilePic || undefined,
        data: p, // Pass the full data object
      })),
    [promoters]
  );

  const supervisorProfiles = useMemo(
    () =>
      supervisors.map((s: any) => ({
        name: [s?.fName, s?.lName].filter(Boolean).join(" ") || "Supervisor",
        imgUrl: s?.profilePic || undefined,
        data: s, // Pass the full data object
      })),
    [supervisors]
  );

  const labourProfiles = useMemo(
    () =>
      labours.map((l: any) => ({
        name:
          [l?.fName, l?.lName].filter(Boolean).join(" ") || l?.work || "Labour",
        imgUrl: l?.profilePic || undefined,
        data: l, // Pass the full data object
      })),
    [labours]
  );

  const vendorProfiles = useMemo(
    () =>
      vendors.map((v: any) => ({
        name: v?.vendorName || "Vendor",
        data: v, // Pass the full data object
      })),
    [vendors]
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
        <HeaderBar title="Manage Organisation" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <HeaderBar title="Manage Organisation" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Company Info Section */}
        <View
          style={[styles.headerSection, { backgroundColor: theme.background }]}
        >
          {refreshingOnFocus && (
            <View
              style={[
                styles.refreshIndicator,
                { backgroundColor: theme.primary },
              ]}
            >
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.refreshText}>Updating...</Text>
            </View>
          )}
          <CompanyInfoCard
            organizationName={orgName || "Organisation"}
            address={orgAddress || ""}
            imageUrl={logoUrl || ""}
            orgId={orgId}
          />
        </View>

        {/* Profiles Section */}
        <View
          style={[
            styles.profilesSection,
            { backgroundColor: theme.background },
          ]}
        >
          <ProfilesRow
            rowTitle="Owners"
            profiles={ownerProfiles}
            onViewAll={handleViewAllPromoters}
            onAddNew={() => {}}
            onProfilePress={handleOwnerPress}
            showDivider={true}
          />

          <ProfilesRow
            rowTitle="Supervisors"
            profiles={supervisorProfiles}
            onViewAll={handleViewAllSupervisors}
            onAddNew={() => setShowAddSupervisorPopup(true)}
            onProfilePress={handleSupervisorPress}
            showDivider={true}
          />

          <ProfilesRow
            rowTitle="Labours"
            profiles={labourProfiles}
            onViewAll={handleViewAllLabours}
            onAddNew={handleAddNewLabour}
            onProfilePress={handleLabourPress}
            showDivider={true}
          />

          <ProfilesRow
            rowTitle="Vendors"
            profiles={vendorProfiles}
            onViewAll={handleViewAllVendors}
            onAddNew={handleAddNewVendor}
            onProfilePress={handleVendorPress}
            showDivider={false} // No divider after the last row
            fallbackIconType="business" // Use business icon for vendors
          />
        </View>
      </ScrollView>

      {/* Add Supervisor Popup */}
      <Modal
        visible={showAddSupervisorPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddSupervisorPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <AddSupervisorPopup
            onClose={() => setShowAddSupervisorPopup(false)}
            onSuccess={() => {
              setShowAddSupervisorPopup(false);
              fetchData(); // Refresh the data
            }}
          />
        </View>
      </Modal>

      {/* Add Labour Popup */}
      <Modal
        visible={showAddLabourPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddLabourPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <AddLabourPopup
            onClose={() => setShowAddLabourPopup(false)}
            onSuccess={() => {
              setShowAddLabourPopup(false);
              fetchData(); // Refresh the data
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerSection: {
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  profilesSection: {
    flex: 1,
    paddingTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  refreshText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
});
