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
import TextInputs from "@/components/ui/inputField";
import { createSupervisorRequest } from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import PasswordField from "@/components/ui/passwordField";

export default function CreateSupervisor() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const phoneFromParams = params.phone as string;

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(phoneFromParams || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (phoneFromParams) {
      setPhone(phoneFromParams);
    }
  }, [phoneFromParams]);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const nameFromUri = asset.uri.split("/").pop() || "profile.jpg";
        const mimeType = asset.mimeType || "image/jpeg";
        setProfilePic({ uri: asset.uri, name: nameFromUri, type: mimeType });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const validateForm = () => {
    if (!fName.trim()) {
      Alert.alert("Error", "First name is required");
      return false;
    }
    if (!lName.trim()) {
      Alert.alert("Error", "Last name is required");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return false;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleCreateSupervisor = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const supervisorData = {
        fName: fName.trim(),
        lName: lName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        profilePic: profilePic || undefined,
      };

      const response = await createSupervisorRequest(supervisorData);

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
      Alert.alert("Error", error.message || "Failed to create supervisor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Create Supervisor" />

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
              Supervisor Information
            </Text>

            <TextInputs
              value={fName}
              onChangeText={setFName}
              placeholder="Enter first name"
              keyboardType="default"
              textname="First Name"
            />

            <TextInputs
              value={lName}
              onChangeText={setLName}
              placeholder="Enter last name"
              keyboardType="default"
              textname="Last Name"
            />

            <TextInputs
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
              textname="Email"
            />

            <TextInputs
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              textname="Phone Number"
            />

            <PasswordField
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              label="Password"
            />

            <PasswordField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm the password"
              label="Confirm Password"
            />

            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <Text style={[styles.profileTitle, { color: theme.text }]}>
                Profile Picture (Optional)
              </Text>
              <TouchableOpacity
                style={[
                  styles.imagePickerButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={handleImagePicker}
              >
                <Text style={[styles.imagePickerText, { color: theme.text }]}>
                  {profilePic
                    ? "Change Profile Picture"
                    : "Select Profile Picture"}
                </Text>
              </TouchableOpacity>
              {profilePic && (
                <Text style={[styles.imageSelected, { color: theme.text }]}>
                  ✓ Image selected
                </Text>
              )}
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: theme.primary },
                loading && styles.disabledButton,
              ]}
              onPress={handleCreateSupervisor}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.text} size="small" />
              ) : (
                <Text style={[styles.createButtonText, { color: theme.text }]}>
                  Create Supervisor
                </Text>
              )}
            </TouchableOpacity>
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
  profileSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  imagePickerButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePickerText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  imageSelected: {
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
  createButton: {
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  createButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
