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
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryBtn from "@/components/ui/primaryBtn";
import { editLabourRequest } from "@/lib/api";
import * as ImagePicker from "expo-image-picker";

interface EditLabourData {
  fName: string;
  lName: string;
  phone: string;
  work: string;
  profilePic?: { uri: string; name: string; type: string } | null;
  documentsUrl?: { uri: string; name: string; type: string }[] | null;
}

export default function EditLabour() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const labourId = params.labourId as string;
  const [formData, setFormData] = useState<EditLabourData>({
    fName: (params.fName as string) || "",
    lName: (params.lName as string) || "",
    phone: (params.phone as string) || "",
    work: (params.work as string) || "",
    profilePic: undefined,
    documentsUrl: undefined,
  });

  const [currentProfilePic, setCurrentProfilePic] = useState<
    string | undefined
  >(params.profilePicUrl as string);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fName.trim()) {
      newErrors.fName = "First name is required";
    }

    if (!formData.lName.trim()) {
      newErrors.lName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.work.trim()) {
      newErrors.work = "Work type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfilePicChange = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setFormData((prev) => ({
          ...prev,
          profilePic: {
            uri: asset.uri,
            name: asset.fileName || "profile.jpg",
            type: "image/jpeg",
          },
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleRemoveProfilePic = () => {
    setFormData((prev) => ({ ...prev, profilePic: null }));
    setCurrentProfilePic(undefined);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await editLabourRequest(labourId, formData);

      if (response.success) {
        Alert.alert("Success", "Labour updated successfully", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to update labour");
      }
    } catch (error) {
      console.error("Error updating labour:", error);
      Alert.alert("Error", "Failed to update labour. Please try again.");
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
      <HeaderBar title="Edit Labour" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Profile Picture
          </Text>

          <View style={styles.profileImageContainer}>
            {formData.profilePic || currentProfilePic ? (
              <Image
                source={{
                  uri: formData.profilePic?.uri || currentProfilePic,
                }}
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

          <View style={styles.profileActions}>
            <TouchableOpacity
              style={[
                styles.profileActionBtn,
                { backgroundColor: theme.primary },
              ]}
              onPress={handleProfilePicChange}
            >
              <Ionicons name="camera-outline" size={20} color={theme.text} />
              <Text style={[styles.profileActionText, { color: theme.text }]}>
                Change Photo
              </Text>
            </TouchableOpacity>

            {(formData.profilePic || currentProfilePic) && (
              <TouchableOpacity
                style={[
                  styles.profileActionBtn,
                  { backgroundColor: "#ef4444" },
                ]}
                onPress={handleRemoveProfilePic}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text style={[styles.profileActionText, { color: "white" }]}>
                  Remove
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Personal Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              First Name *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.listItemFill,
                  color: theme.text,
                  borderColor: errors.fName ? "#ef4444" : theme.border,
                },
              ]}
              value={formData.fName}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, fName: text }));
                if (errors.fName) {
                  setErrors((prev) => ({ ...prev, fName: "" }));
                }
              }}
              placeholder="Enter first name"
              placeholderTextColor={theme.textSecondary}
            />
            {errors.fName && (
              <Text style={styles.errorText}>{errors.fName}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Last Name *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.listItemFill,
                  color: theme.text,
                  borderColor: errors.lName ? "#ef4444" : theme.border,
                },
              ]}
              value={formData.lName}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, lName: text }));
                if (errors.lName) {
                  setErrors((prev) => ({ ...prev, lName: "" }));
                }
              }}
              placeholder="Enter last name"
              placeholderTextColor={theme.textSecondary}
            />
            {errors.lName && (
              <Text style={styles.errorText}>{errors.lName}</Text>
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
                  borderColor: errors.phone ? "#ef4444" : theme.border,
                },
              ]}
              value={formData.phone}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, phone: text }));
                if (errors.phone) {
                  setErrors((prev) => ({ ...prev, phone: "" }));
                }
              }}
              placeholder="Enter phone number"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Work Type *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.listItemFill,
                  color: theme.text,
                  borderColor: errors.work ? "#ef4444" : theme.border,
                },
              ]}
              value={formData.work}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, work: text }));
                if (errors.work) {
                  setErrors((prev) => ({ ...prev, work: "" }));
                }
              }}
              placeholder="Enter work type"
              placeholderTextColor={theme.textSecondary}
            />
            {errors.work && <Text style={styles.errorText}>{errors.work}</Text>}
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
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  profileActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },
  profileActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 8,
  },
  profileActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
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
