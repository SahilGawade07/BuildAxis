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
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import reusable components
import TextInputs from "../../../components/ui/inputField";
import { ContinueBtn } from "../../../components/ui/ContinueBtn";
import { useTheme } from "../../../context/ThemeContext";
import { updateUserProfile } from "../../../lib/api";

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [user, setUser] = useState({
    id: "",
    fName: "",
    lName: "",
    email: "",
    phone: "",
    profilePic: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setInitialLoading(true);

      // Get user info from AsyncStorage
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (!userInfo) {
        Alert.alert("Error", "User data not found. Please login again.");
        router.replace("/(auth)/login");
        return;
      }

      const userData = JSON.parse(userInfo);
      setUser({
        id: userData.id || "",
        fName: userData.fName || "",
        lName: userData.lName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        profilePic:
          userData.profilePic ||
          "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      });
    } catch (error) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setInitialLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, profilePic: result.assets[0].uri });
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Update profile using the new API utility
      const result = await updateUserProfile({
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic,
      });

      if (result.success) {
        Alert.alert("Success", "Profile updated successfully!");

        // Update stored user info
        const currentUserInfo = await AsyncStorage.getItem("userInfo");
        if (currentUserInfo) {
          const userInfo = JSON.parse(currentUserInfo);
          const updatedUserInfo = {
            ...userInfo,
            fName: user.fName,
            lName: user.lName,
            email: user.email,
            phone: user.phone,
            profilePic: user.profilePic,
          };
          await AsyncStorage.setItem(
            "userInfo",
            JSON.stringify(updatedUserInfo)
          );
        }

        router.back();
      } else {
        Alert.alert("Error", result.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);

      if (error.message.includes("Authentication expired")) {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/(auth)/login");
      } else {
        Alert.alert("Error", error.message || "Something went wrong");
      }
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
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading profile...
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
          <Ionicons
            name="chevron-back"
            size={30}
            color={theme.text}
            onPress={() => router.back()}
          />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Edit Profile
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
            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.avatarContainer}
              >
                <Image
                  source={{ uri: user.profilePic }}
                  style={styles.avatar}
                />
                <View style={styles.changePhotoOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={[styles.changePhotoText, { color: theme.text }]}>
                Change Profile Picture
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <TextInputs
                value={user.fName}
                onChangeText={(text: string) =>
                  setUser({ ...user, fName: text })
                }
                placeholder="Enter your first name"
                keyboardType="default"
                textname="First Name"
              />

              <TextInputs
                value={user.lName}
                onChangeText={(text: string) =>
                  setUser({ ...user, lName: text })
                }
                placeholder="Enter your last name"
                keyboardType="default"
                textname="Last Name"
              />

              <TextInputs
                value={user.email}
                onChangeText={(text: string) =>
                  setUser({ ...user, email: text })
                }
                placeholder="Enter your email"
                keyboardType="email-address"
                textname="Email"
              />

              <TextInputs
                value={user.phone}
                onChangeText={(text: string) =>
                  setUser({ ...user, phone: text })
                }
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                textname="Phone"
              />

              {/* Save Button */}
              <ContinueBtn
                text={loading ? "Saving..." : "Save Changes"}
                touchable={!loading}
                onPresss={handleUpdate}
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
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
  },
  changePhotoOverlay: {
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
  changePhotoText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
