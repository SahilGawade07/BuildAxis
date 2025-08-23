import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { TextInput } from "react-native";
import { createVendorRequest, getServicesRequest } from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryBtn from "@/components/ui/primaryBtn";
import AddServicePopup from "@/components/Profile/ManageOrganisation/addServicePopup";

export default function CreateVendor() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const phoneFromParams = params.phone as string;

  const [vendorName, setVendorName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNo, setPhoneNo] = useState(phoneFromParams || "");
  const [address, setAddress] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [showAddServicePopup, setShowAddServicePopup] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    if (phoneFromParams) {
      setPhoneNo(phoneFromParams);
    }
    fetchServices();
  }, [phoneFromParams]);

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const response = await getServicesRequest();
      if (response.success && response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setServicesLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find((s) => s._id === serviceId);
    return service ? service.serviceName : "Unknown Service";
  };

  const validateForm = () => {
    if (!vendorName.trim()) {
      Alert.alert("Error", "Vendor name is required");
      return false;
    }

    if (!contactPerson.trim()) {
      Alert.alert("Error", "Contact person is required");
      return false;
    }

    if (!phoneNo.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }

    if (!address.trim()) {
      Alert.alert("Error", "Address is required");
      return false;
    }

    return true;
  };

  const handleCreateVendor = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const vendorData = {
        vendorName: vendorName.trim(),
        contactPerson: contactPerson.trim(),
        phoneNo: phoneNo.trim(),
        address: address.trim(),
        services: selectedServices,
        gstNumber: gstNumber.trim() || undefined,
      };

      const response = await createVendorRequest(vendorData);

      if (response.success) {
        Alert.alert("Success", response.message, [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(tabs)/profile/manageOrganisation");
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAdded = () => {
    setShowAddServicePopup(false);
    fetchServices(); // Refresh services list
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Create Vendor" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Vendor Information
            </Text>

            <View
              style={[styles.infoBox, { backgroundColor: theme.secondary }]}
            >
              <Text style={[styles.infoText, { color: theme.text }]}>
                💡 You can either add existing vendor by phone number (from the
                previous screen) or create a completely new vendor profile here.
              </Text>
            </View>

            <TextInput
              value={vendorName}
              onChangeText={setVendorName}
              placeholder="Enter vendor/company name"
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
              ]}
            />

            <TextInput
              value={contactPerson}
              onChangeText={setContactPerson}
              placeholder="Enter contact person name"
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
              ]}
            />

            <TextInput
              value={phoneNo}
              onChangeText={setPhoneNo}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
              ]}
            />

            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter vendor address"
              multiline
              numberOfLines={3}
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
                styles.addressInput,
              ]}
            />

            <TextInput
              value={gstNumber}
              onChangeText={setGstNumber}
              placeholder="Enter GST number (optional)"
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
              ]}
            />

            {/* Services Section */}
            <View style={styles.servicesSection}>
              <Text style={[styles.servicesTitle, { color: theme.text }]}>
                Services Offered (Optional)
              </Text>

              {servicesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={theme.primary} size="small" />
                  <Text style={[styles.loadingText, { color: theme.text }]}>
                    Loading services...
                  </Text>
                </View>
              ) : (
                <>
                  {/* Services List */}
                  <View style={styles.servicesList}>
                    {services.map((service) => (
                      <TouchableOpacity
                        key={service._id}
                        style={[
                          styles.serviceItem,
                          selectedServices.includes(service._id) && {
                            backgroundColor: theme.primary,
                          },
                        ]}
                        onPress={() => toggleService(service._id)}
                      >
                        <Text
                          style={[
                            styles.serviceText,
                            {
                              color: selectedServices.includes(service._id)
                                ? theme.text
                                : theme.text,
                            },
                          ]}
                        >
                          {service.serviceName}
                        </Text>
                        {selectedServices.includes(service._id) && (
                          <Text
                            style={[styles.checkmark, { color: theme.text }]}
                          >
                            ✓
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Add New Service Button */}
                  <TouchableOpacity
                    style={[
                      styles.addServiceButton,
                      { backgroundColor: theme.secondary },
                    ]}
                    onPress={() => setShowAddServicePopup(true)}
                  >
                    <Text
                      style={[styles.addServiceText, { color: theme.text }]}
                    >
                      + Add New Service
                    </Text>
                  </TouchableOpacity>

                  {/* Selected Services Display */}
                  {selectedServices.length > 0 && (
                    <View style={styles.selectedServicesContainer}>
                      <Text
                        style={[
                          styles.selectedServicesTitle,
                          { color: theme.text },
                        ]}
                      >
                        Selected Services:
                      </Text>
                      {selectedServices.map((serviceId) => (
                        <View
                          key={serviceId}
                          style={styles.selectedServiceItem}
                        >
                          <Text
                            style={[
                              styles.selectedServiceText,
                              { color: theme.text },
                            ]}
                          >
                            {getServiceName(serviceId)}
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.removeButton,
                              { backgroundColor: theme.primary },
                            ]}
                            onPress={() => toggleService(serviceId)}
                          >
                            <Text
                              style={[
                                styles.removeButtonText,
                                { color: theme.text },
                              ]}
                            >
                              Remove
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Create Button */}
            <PrimaryBtn
              text={loading ? "Creating..." : "Create Vendor"}
              onPress={handleCreateVendor}
            />

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.primary} size="large" />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Add Service Popup */}
      <AddServicePopup
        visible={showAddServicePopup}
        onClose={() => setShowAddServicePopup(false)}
        onSuccess={handleServiceAdded}
      />
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
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  servicesSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  servicesList: {
    marginBottom: 15,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginBottom: 8,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  serviceText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  addServiceButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  addServiceText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  selectedServicesContainer: {
    marginTop: 15,
  },
  selectedServicesTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  selectedServiceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedServiceText: {
    fontSize: 14,
    flex: 1,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  addressInput: {
    height: 80,
    textAlignVertical: "top",
  },
});
