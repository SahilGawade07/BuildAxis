import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryBtn from "@/components/ui/primaryBtn";
import { editVendorRequest } from "@/lib/api";

interface EditVendorData {
  vendorName: string;
  contactPerson: string;
  phoneNo: string;
  address: string;
  services: string[];
  gstNumber?: string;
}

export default function EditVendor() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const vendorId = params.vendorId as string;
  const [formData, setFormData] = useState<EditVendorData>({
    vendorName: (params.name as string) || "",
    contactPerson: (params.contactPerson as string) || "",
    phoneNo: (params.phoneNo as string) || "",
    address: (params.address as string) || "",
    services: (params.services as string)?.split(",") || [],
    gstNumber: (params.gstNumber as string) || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendorName.trim()) {
      newErrors.vendorName = "Company name is required";
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNo.trim())) {
      newErrors.phoneNo = "Phone number must be 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await editVendorRequest(vendorId, formData);

      if (response.success) {
        Alert.alert("Success", "Vendor updated successfully", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to update vendor");
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      Alert.alert("Error", "Failed to update vendor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Edit Vendor" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Company Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Company Name *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.listItemFill,
                  color: theme.text,
                  borderColor: errors.vendorName ? "#ef4444" : theme.border,
                },
              ]}
              value={formData.vendorName}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, vendorName: text }));
                if (errors.vendorName) {
                  setErrors((prev) => ({ ...prev, vendorName: "" }));
                }
              }}
              placeholder="Enter company name"
              placeholderTextColor={theme.textSecondary}
            />
            {errors.vendorName && (
              <Text style={styles.errorText}>{errors.vendorName}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Contact Person *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.listItemFill,
                  color: theme.text,
                  borderColor: errors.contactPerson ? "#ef4444" : theme.border,
                },
              ]}
              value={formData.contactPerson}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, contactPerson: text }));
                if (errors.contactPerson) {
                  setErrors((prev) => ({ ...prev, contactPerson: "" }));
                }
              }}
              placeholder="Enter contact person name"
              placeholderTextColor={theme.textSecondary}
            />
            {errors.contactPerson && (
              <Text style={styles.errorText}>{errors.contactPerson}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Phone Number *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.listItemFill,
                  color: theme.text,
                  borderColor: errors.phoneNo ? "#ef4444" : theme.border,
                },
              ]}
              value={formData.phoneNo}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, phoneNo: text }));
                if (errors.phoneNo) {
                  setErrors((prev) => ({ ...prev, phoneNo: "" }));
                }
              }}
              placeholder="Enter phone number"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {errors.phoneNo && (
              <Text style={styles.errorText}>{errors.phoneNo}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Address *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.listItemFill,
                  color: theme.text,
                  borderColor: errors.address ? "#ef4444" : theme.border,
                },
              ]}
              value={formData.address}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, address: text }));
                if (errors.address) {
                  setErrors((prev) => ({ ...prev, address: "" }));
                }
              }}
              placeholder="Enter address"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              GST Number
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.listItemFill,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={formData.gstNumber}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, gstNumber: text }));
              }}
              placeholder="Enter GST number (optional)"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.secondary }]}
            onPress={handleBack}
            disabled={loading}
          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.primary },
              loading && { opacity: 0.6 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.text} />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color={theme.text} />
                <Text style={[styles.actionButtonText, { color: theme.text }]}>
                  Save Changes
                </Text>
              </>
            )}
          </TouchableOpacity>
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
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
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
});
