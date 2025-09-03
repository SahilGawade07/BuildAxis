import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { addServiceRequest } from "@/lib/api";

interface AddServicePopupProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddServicePopup({
  visible,
  onClose,
  onSuccess,
}: AddServicePopupProps) {
  const { theme } = useTheme();
  const [serviceName, setServiceName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddService = async () => {
    if (!serviceName.trim()) {
      Alert.alert("Error", "Service name is required");
      return;
    }

    setLoading(true);
    try {
      const response = await addServiceRequest({
        serviceName: serviceName.trim(),
      });

      if (response.success) {
        Alert.alert("Success", response.message, [
          {
            text: "OK",
            onPress: () => {
              setServiceName("");
              onSuccess();
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setServiceName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.background }]}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.text }]}>
                Add New Service
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={[styles.closeButtonText, { color: theme.text }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={[styles.label, { color: theme.text }]}>
                Service Name
              </Text>
              <TextInput
                value={serviceName}
                onChangeText={setServiceName}
                placeholder="Enter service name"
                style={[
                  styles.input,
                  { color: theme.text, borderColor: theme.secondary },
                ]}
                autoFocus
              />

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    { backgroundColor: theme.secondary },
                  ]}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text
                    style={[styles.cancelButtonText, { color: theme.text2 }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.primary }]}
                  onPress={handleAddService}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.text} size="small" />
                  ) : (
                    <Text style={[styles.addButtonText, { color: theme.text2 }]}>
                      Add Service
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalSafeArea: {
    borderRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
