import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import reusable components
import TextInputs from "../../../../components/ui/inputField";
import { ContinueBtn } from "../../../../components/ui/ContinueBtn";
import { useTheme } from "../../../../context/ThemeContext";
import { updateOrganisationRequest } from "../../../../lib/api";

export default function EditOrganisationScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { orgId } = useLocalSearchParams<{ orgId: string }>();

  const [organisation, setOrganisation] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  // Load organisation data on component mount
  useEffect(() => {
    loadOrganisationData();
  }, []);

  const loadOrganisationData = async () => {
    try {
      setInitialLoading(true);

      // Get organisation info from AsyncStorage
      const orgInfo = await AsyncStorage.getItem("organizationInfo");
      if (!orgInfo) {
        Alert.alert("Error", "Organisation data not found. Please try again.");
        router.back();
        return;
      }

      const orgData = JSON.parse(orgInfo);
      setOrganisation({
        name: orgData.orgName || "",
        email: orgData.email || "",
        phone: orgData.phone || "",
        address: orgData.address || "",
        logoUrl: orgData.logoUrl || "",
      });
    } catch (error) {
      console.error("Error loading organisation data:", error);
      Alert.alert("Error", "Failed to load organisation data");
    } finally {
      setInitialLoading(false);
    }
  };

  const pickLogo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedLogo({
        uri: asset.uri,
        name: asset.fileName || "logo.jpg",
        type: "image/jpeg",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      if (!orgId) {
        Alert.alert("Error", "Organisation ID not found");
        return;
      }

      // Prepare update data
      const updateData: any = {};
      if (organisation.name) updateData.name = organisation.name;
      if (organisation.email) updateData.email = organisation.email;
      if (organisation.phone) updateData.phone = organisation.phone;
      if (organisation.address) updateData.address = organisation.address;

      // Handle logo: if selectedLogo is null (removed), set logo to null; if selectedLogo exists, upload new logo
      if (selectedLogo === null) {
        updateData.logo = null; // Remove logo
      } else if (selectedLogo) {
        updateData.logo = selectedLogo; // Upload new logo
      }

      // Update organisation using the API
      const result = await updateOrganisationRequest(orgId, updateData);

      if (result.success) {
        // Update local storage with the latest data from the API response
        const currentOrgInfo = await AsyncStorage.getItem("organizationInfo");
        if (currentOrgInfo) {
          const currentData = JSON.parse(currentOrgInfo);
          const updatedData = {
            ...currentData,
            orgName:
              result.data?.name || organisation.name || currentData.orgName,
            email:
              result.data?.email || organisation.email || currentData.email,
            phone:
              result.data?.phone || organisation.phone || currentData.phone,
            address:
              result.data?.address ||
              organisation.address ||
              currentData.address,
            logoUrl: result.data?.logoUrl || currentData.logoUrl,
          };
          await AsyncStorage.setItem(
            "organizationInfo",
            JSON.stringify(updatedData)
          );
        }

        Alert.alert("Success", "Organisation updated successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to update organisation");
      }
    } catch (error: any) {
      console.error("Error updating organisation:", error);
      Alert.alert("Error", error.message || "Failed to update organisation");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading organisation...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Edit Organisation
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <TouchableOpacity onPress={pickLogo} style={styles.logoContainer}>
                {selectedLogo?.uri || organisation.logoUrl ? (
                  <Image
                    source={{ uri: selectedLogo?.uri || organisation.logoUrl }}
                    style={styles.logo}
                  />
                ) : (
                  <View
                    style={[
                      styles.fallbackLogo,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <Text style={styles.logoInitial}>
                      {organisation.name
                        ? organisation.name.charAt(0).toUpperCase()
                        : "O"}
                    </Text>
                  </View>
                )}
                <View style={styles.changeLogoOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={[styles.changeLogoText, { color: theme.text }]}>
                Change Organisation Logo
              </Text>

              {/* Remove Logo Button */}
              {(organisation.logoUrl || selectedLogo) && (
                <TouchableOpacity
                  style={[
                    styles.removeLogoButton,
                    {
                      backgroundColor:
                        selectedLogo === null ? theme.onging : theme.error,
                    },
                  ]}
                  onPress={() => {
                    if (selectedLogo === null) {
                      // If logo is already marked for removal, restore it
                      setSelectedLogo(undefined as any);
                    } else {
                      // Mark logo for removal
                      setSelectedLogo(null);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      selectedLogo === null
                        ? "refresh-outline"
                        : "trash-outline"
                    }
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.removeLogoText}>
                    {selectedLogo === null ? "Restore Logo" : "Remove Logo"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <TextInputs
                value={organisation.name}
                onChangeText={(text: string) =>
                  setOrganisation({ ...organisation, name: text })
                }
                placeholder="Enter organisation name"
                keyboardType="default"
                textname="Organisation Name"
              />

              <TextInputs
                value={organisation.email}
                onChangeText={(text: string) =>
                  setOrganisation({ ...organisation, email: text })
                }
                placeholder="Enter organisation email"
                keyboardType="email-address"
                textname="Email"
              />

              <TextInputs
                value={organisation.phone}
                onChangeText={(text: string) =>
                  setOrganisation({ ...organisation, phone: text })
                }
                placeholder="Enter organisation phone"
                keyboardType="phone-pad"
                textname="Phone"
              />

              <TextInputs
                value={organisation.address}
                onChangeText={(text: string) =>
                  setOrganisation({ ...organisation, address: text })
                }
                placeholder="Enter organisation address"
                keyboardType="default"
                textname="Address"
              />

              {/* Save Button */}
              <ContinueBtn
                text={loading ? "Saving..." : "Save Changes"}
                touchable={!loading}
                onPress={handleUpdate}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
  },
  fallbackLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  logoInitial: {
    fontSize: 48,
    fontWeight: "700",
    color: "#fff",
  },
  changeLogoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  changeLogoText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  removeLogoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
  },
  removeLogoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  form: {
    width: "100%",
  },
});
