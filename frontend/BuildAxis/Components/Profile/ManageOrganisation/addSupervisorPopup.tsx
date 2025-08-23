import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import TextInputs from "@/components/ui/inputField";
import { addSupervisorToOrganisation } from "@/lib/api";
import { router } from "expo-router";
import ContactPicker from "./ContactPicker";

interface AddSupervisorPopupProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddSupervisorPopup({
  onClose,
  onSuccess,
}: AddSupervisorPopupProps) {
  const [supervisorPhone, setSupervisorPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const { theme } = useTheme();

  const handleAddSupervisor = async () => {
    if (!supervisorPhone.trim()) {
      Alert.alert("Error", "Please enter supervisor phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await addSupervisorToOrganisation(
        supervisorPhone.trim()
      );

      // If server instructs to create supervisor, redirect regardless of success flag
      if (response.action === "CREATE_SUPERVISOR") {
        router.push({
          pathname: "/profile/manageOrganisation/createSupervisor",
          params: { phone: supervisorPhone.trim() },
        });
        return;
      }

      if (response.success) {
        Alert.alert("Success", response.message, [
          {
            text: "OK",
            onPress: () => {
              onSuccess?.();
              onClose();
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add supervisor");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromContacts = () => {
    setShowContactPicker(true);
  };

  const handleContactSelected = (phoneNumber: string) => {
    setSupervisorPhone(phoneNumber);
  };

  return (
    <View style={[styles.modal, { backgroundColor: theme.listItemFill }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.text }]}>
          Add Supervisor
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: theme.text }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      <TextInputs
        value={supervisorPhone}
        onChangeText={setSupervisorPhone}
        placeholder="Enter supervisor phone number"
        keyboardType="phone-pad"
        textname="Phone Number"
      />

      {/* Select from Contacts Button */}
      <TouchableOpacity
        style={[styles.selectButton, { backgroundColor: theme.secondary }]}
        onPress={handleSelectFromContacts}
      >
        <Text style={[styles.selectButtonText, { color: theme.text }]}>
          Select from Contacts
        </Text>
      </TouchableOpacity>

      {/* Add to Organisation Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: theme.primary },
          loading && styles.disabledButton,
        ]}
        onPress={handleAddSupervisor}
        disabled={loading}
      >
        <Text style={[styles.addButtonText, { color: theme.text }]}>
          {loading ? "Adding..." : "Add to Organisation"}
        </Text>
      </TouchableOpacity>

      {/* Contact Picker Modal */}
      <ContactPicker
        visible={showContactPicker}
        onClose={() => setShowContactPicker(false)}
        onSelectContact={handleContactSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  selectButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 10,
  },
  selectButtonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
