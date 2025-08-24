import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Reusable components
import Add_items from "@/components/ui/add_item";
import { Safe_area } from "@/components/ui/safeArea";
import Submit_bbutt from "@/components/ui/SubmitBtn";
import TextInputs from "@/components/ui/inputField";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { createSiteRequest } from "@/lib/api";

export default function CreateSiteScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // State for form inputs
  const [siteName, setSiteName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [orgId, setOrgId] = useState("");
  const [loading, setLoading] = useState(false);

  // Get organization ID on component mount
  useEffect(() => {
    const getOrgId = async () => {
      try {
        const storedInfo = await AsyncStorage.getItem("organizationInfo");
        if (storedInfo) {
          const parsed = JSON.parse(storedInfo);
          setOrgId(parsed.orgId);
        }
      } catch (error) {
        console.error("Error getting org ID:", error);
      }
    };
    getOrgId();
  }, []);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const validateForm = () => {
    if (!siteName.trim()) {
      Alert.alert("Error", "Site name is required");
      return false;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Address is required");
      return false;
    }
    if (!customerName.trim()) {
      Alert.alert("Error", "Customer name is required");
      return false;
    }
    if (!budget.trim() || isNaN(Number(budget)) || Number(budget) <= 0) {
      Alert.alert("Error", "Please enter a valid budget amount");
      return false;
    }
    if (!orgId) {
      Alert.alert(
        "Error",
        "Organization information not found. Please login again."
      );
      return false;
    }
    if (startDate >= endDate) {
      Alert.alert("Error", "End date must be after start date");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const siteData = {
        name: siteName.trim(),
        address: address.trim(),
        description: description.trim() || undefined,
        budget: Number(budget),
        startDate: startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        endDate: endDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        customerName: customerName.trim(),
        orgId: orgId,
      };

      const response = await createSiteRequest(siteData);

      if (response.success) {
        Alert.alert("Success", "Site created successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to create site");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Custom Safe Area Styling */}
      <Safe_area />

      {/* Back Button + Title */}
      <HeaderBar title="Create a New Site" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Site Name Input */}
          <TextInputs
            value={siteName}
            onChangeText={setSiteName}
            placeholder="Enter site name"
            keyboardType="default"
            textname="Site Name *"
          />

          {/* Customer Name Input */}
          <TextInputs
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Enter customer name"
            keyboardType="default"
            textname="Customer Name *"
          />

          {/* Address Input */}
          <TextInputs
            value={address}
            onChangeText={setAddress}
            placeholder="Enter site address"
            keyboardType="default"
            textname="Address *"
          />

          {/* Description Input */}
          <TextInputs
            value={description}
            onChangeText={setDescription}
            placeholder="Enter site description (optional)"
            keyboardType="default"
            textname="Description"
          />

          {/* Budget Input */}
          <TextInputs
            value={budget}
            onChangeText={setBudget}
            placeholder="Enter budget amount"
            keyboardType="numeric"
            textname="Budget (₹) *"
          />

          {/* Start Date */}
          <Text style={[styles.label, { color: theme.text }]}>
            Start Date *
          </Text>
          <View
            style={[
              styles.dateContainer,
              {
                borderColor: theme.listItemBorder,
                backgroundColor: theme.listItemFill,
              },
            ]}
          >
            <Text style={[styles.dateText, { color: theme.text }]}>
              {startDate.toLocaleDateString()}
            </Text>
            <Text
              style={[styles.dateButton, { color: theme.primary }]}
              onPress={() => setShowStartDatePicker(true)}
            >
              Select Date
            </Text>
          </View>

          {/* End Date */}
          <Text style={[styles.label, { color: theme.text }]}>End Date *</Text>
          <View
            style={[
              styles.dateContainer,
              {
                borderColor: theme.listItemBorder,
                backgroundColor: theme.listItemFill,
              },
            ]}
          >
            <Text style={[styles.dateText, { color: theme.text }]}>
              {endDate.toLocaleDateString()}
            </Text>
            <Text
              style={[styles.dateButton, { color: theme.primary }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              Select Date
            </Text>
          </View>

          {/* Submit Button */}
          <Submit_bbutt
            text={loading ? "Creating Site..." : "Create Site"}
            onPress={handleSubmit}
            disabled={loading}
          />
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          minimumDate={new Date()}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={startDate}
        />
      )}
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
  form: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 3,
    fontWeight: "500",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
  },
  dateButton: {
    fontSize: 14,
    fontWeight: "500",
  },
});
