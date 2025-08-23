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
import { createLabourRequest } from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import PrimaryBtn from "@/components/ui/primaryBtn";

export default function CreateLabour() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const phoneFromParams = params.phone as string;

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [phone, setPhone] = useState(phoneFromParams || "");
  const [work, setWork] = useState("");
  const [profilePic, setProfilePic] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [documentsUrl, setDocumentsUrl] = useState<string[]>([]);
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
        const newProfilePic = {
          uri: asset.uri,
          name: nameFromUri,
          type: mimeType,
        };
        console.log("Setting profilePic:", newProfilePic);
        setProfilePic(newProfilePic);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newDocuments = result.assets.map((asset) => asset.uri);
        setDocumentsUrl([...documentsUrl, ...newDocuments]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick documents");
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = documentsUrl.filter((_, i) => i !== index);
    setDocumentsUrl(newDocuments);
  };

  const validateForm = () => {
    console.log("=== VALIDATION START ===");
    console.log(
      "Validation - fName:",
      fName,
      "lName:",
      lName,
      "phone:",
      phone,
      "work:",
      work,
      "profilePic:",
      profilePic
    );

    console.log("fName.trim() result:", fName.trim());
    console.log("fName.trim() length:", fName.trim().length);
    console.log("!fName.trim() result:", !fName.trim());

    if (!fName.trim()) {
      console.log("❌ First name validation failed!");
      Alert.alert("Error", "First name is required");
      return false;
    }
    console.log("✅ First name validation passed");

    if (!lName.trim()) {
      console.log("❌ Last name validation failed!");
      Alert.alert("Error", "Last name is required");
      return false;
    }
    console.log("✅ Last name validation passed");

    if (!phone.trim()) {
      console.log("❌ Phone validation failed!");
      Alert.alert("Error", "Phone number is required");
      return false;
    }
    console.log("✅ Phone validation passed");

    if (!work.trim()) {
      console.log("❌ Work validation failed!");
      Alert.alert("Error", "Work type is required");
      return false;
    }
    console.log("✅ Work validation passed");

    if (!profilePic) {
      console.log("❌ Profile picture validation failed!");
      Alert.alert("Error", "Profile picture is required");
      return false;
    }
    console.log("✅ Profile picture validation passed");

    console.log("=== ALL VALIDATIONS PASSED ===");
    return true;
  };

  const handleCreateLabour = async () => {
    console.log("🚀 handleCreateLabour called");

    // Add a small delay to ensure state is fully updated
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log("⏰ Delay completed, calling validateForm");

    if (!validateForm()) {
      console.log("❌ Validation failed, returning early");
      return;
    }

    console.log("✅ Validation passed, proceeding with API call");

    setLoading(true);
    try {
      const labourData = {
        fName: fName.trim(),
        lName: lName.trim(),
        phone: phone.trim(),
        work: work.trim(),
        profilePic: profilePic || undefined,
        documentsUrl: documentsUrl,
      };

      console.log(
        "📤 Sending data to server:",
        JSON.stringify(labourData, null, 2)
      );
      console.log(
        "📤 fName type:",
        typeof labourData.fName,
        "value:",
        labourData.fName
      );
      console.log(
        "📤 lName type:",
        typeof labourData.lName,
        "value:",
        labourData.lName
      );
      console.log(
        "📤 phone type:",
        typeof labourData.phone,
        "value:",
        labourData.phone
      );
      console.log(
        "📤 work type:",
        typeof labourData.work,
        "value:",
        labourData.work
      );
      console.log(
        "📤 profilePic type:",
        typeof labourData.profilePic,
        "value:",
        labourData.profilePic
      );

      const response = await createLabourRequest(labourData);

      console.log("📥 Server response:", JSON.stringify(response, null, 2));
      console.log("📥 Response success:", response.success);
      console.log("📥 Response message:", response.message);

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
      Alert.alert("Error", error.message || "Failed to create labour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Create Labour" />

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
              Labour Information
            </Text>

            <View
              style={[styles.infoBox, { backgroundColor: theme.secondary }]}
            >
              <Text style={[styles.infoText, { color: theme.text }]}>
                💡 You can either add existing labour by phone number (from the
                previous screen) or create a completely new labour profile here.
              </Text>
            </View>

            <TextInput
              value={fName}
              onChangeText={(text: string) => {
                console.log("Setting fName to:", text);
                setFName(text);
              }}
              placeholder="Enter first name"
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
              ]}
            />

            <TextInput
              value={lName}
              onChangeText={(text: string) => {
                console.log("Setting lName to:", text);
                setLName(text);
              }}
              placeholder="Enter last name"
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
              ]}
            />

            <TextInput
              value={phone}
              onChangeText={(text: string) => {
                console.log("Setting phone to:", text);
                setPhone(text);
              }}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
              ]}
            />

            <TextInput
              value={work}
              onChangeText={(text: string) => {
                console.log("Setting work to:", text);
                setWork(text);
              }}
              placeholder="Enter work type (e.g., Mason, Carpenter, Electrician)"
              style={[
                styles.textInput,
                { color: theme.text, borderColor: theme.secondary },
              ]}
            />

            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <Text style={[styles.profileTitle, { color: theme.text }]}>
                Profile Picture *
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

            {/* Documents Section */}
            <View style={styles.documentsSection}>
              <Text style={[styles.documentsTitle, { color: theme.text }]}>
                Documents (Optional)
              </Text>
              <TouchableOpacity
                style={[
                  styles.documentPickerButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={handleDocumentPicker}
              >
                <Text
                  style={[styles.documentPickerText, { color: theme.text }]}
                >
                  Add Documents
                </Text>
              </TouchableOpacity>

              {documentsUrl.length > 0 && (
                <View style={styles.documentsList}>
                  <Text
                    style={[styles.documentsSubtitle, { color: theme.text }]}
                  >
                    Selected Documents:
                  </Text>
                  {documentsUrl.map((doc, index) => (
                    <View key={index} style={styles.documentItem}>
                      <Text
                        style={[styles.documentText, { color: theme.text }]}
                      >
                        Document {index + 1}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.removeButton,
                          { backgroundColor: theme.primary },
                        ]}
                        onPress={() => removeDocument(index)}
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
            </View>

            {/* Debug Button - Remove this after testing */}
            <TouchableOpacity
              style={[styles.debugButton, { backgroundColor: theme.secondary }]}
              onPress={() => {
                console.log("Current state values:");
                console.log("fName:", fName);
                console.log("lName:", lName);
                console.log("phone:", phone);
                console.log("work:", work);
                console.log("profilePic:", profilePic);
                console.log("documentsUrl:", documentsUrl);
              }}
            >
              <Text style={[styles.debugButtonText, { color: theme.text }]}>
                Debug: Show Current Values
              </Text>
            </TouchableOpacity>

            {/* Create Button */}
            <PrimaryBtn
              text={loading ? "Creating..." : "Create Labour"}
              onPress={handleCreateLabour}
            />

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.primary} size="large" />
              </View>
            )}
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
  profileSection: {
    marginTop: 20,
    marginBottom: 20,
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
  documentsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  documentPickerButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  documentPickerText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  documentsList: {
    marginTop: 10,
  },
  documentsSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },
  documentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    marginBottom: 8,
  },
  documentText: {
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
  },
  debugButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 10,
  },
  debugButtonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
});
