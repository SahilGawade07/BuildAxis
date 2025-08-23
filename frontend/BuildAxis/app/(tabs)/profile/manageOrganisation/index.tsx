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

  const fetchData = async (showRefreshIndicator = false) => {
    try {
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
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Map API entities to ProfilesRow structure
  const ownerProfiles = useMemo(
    () =>
      promoters.map((p: any) => ({
        name: [p?.fName, p?.lName].filter(Boolean).join(" ") || "Owner",
        imgUrl: p?.profilePic || undefined,
      })),
    [promoters]
  );

  const supervisorProfiles = useMemo(
    () =>
      supervisors.map((s: any) => ({
        name: [s?.fName, s?.lName].filter(Boolean).join(" ") || "Supervisor",
        imgUrl: s?.profilePic || undefined,
      })),
    [supervisors]
  );

  const labourProfiles = useMemo(
    () =>
      labours.map((l: any) => ({
        name:
          [l?.fName, l?.lName].filter(Boolean).join(" ") || l?.work || "Labour",
        imgUrl: l?.profilePic || undefined,
      })),
    [labours]
  );

  const vendorProfiles = useMemo(
    () =>
      vendors.map((v: any) => ({
        name: v?.vendorName || "Vendor",
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
          <CompanyInfoCard
            organizationName={orgName || "Organisation"}
            address={orgAddress || ""}
            imageUrl={logoUrl || ""}
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
            showDivider={true}
          />

          <ProfilesRow
            rowTitle="Supervisors"
            profiles={supervisorProfiles}
            onViewAll={handleViewAllSupervisors}
            onAddNew={() => setShowAddSupervisorPopup(true)}
            showDivider={true}
          />

          <ProfilesRow
            rowTitle="Labours"
            profiles={labourProfiles}
            onViewAll={handleViewAllLabours}
            onAddNew={handleAddNewLabour}
            showDivider={true}
          />

          <ProfilesRow
            rowTitle="Vendors"
            profiles={vendorProfiles}
            onViewAll={handleViewAllVendors}
            onAddNew={() => {}}
            showDivider={false} // No divider after the last row
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
});
