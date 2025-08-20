// ... imports remain same
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Linking,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import Menu from "@/components/Profile/MenuList";
import LogoutButton from "@/components/Profile/LogoutBtn";
import { router } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { updatePasswordRequest } from "@/lib/api";

interface MenuItem {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  menuItemName: string;
  onPress: () => void;
}

interface UserData {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  profilePic?: string;
}

const ProfilePage = () => {
  const { theme } = useTheme();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storageData, setStorageData] = useState<Record<string, string>>({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  // Fetch user + storage data every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);

          // Load user info
          const storedData = await AsyncStorage.getItem("userInfo");
          if (storedData) {
            setUser(JSON.parse(storedData));
          }

          // Load all key-value pairs from AsyncStorage
          const keys = await AsyncStorage.getAllKeys();
          const entries = await AsyncStorage.multiGet(keys);
          const mapped: Record<string, string> = {};
          entries.forEach(([key, value]) => {
            mapped[key] = value ?? "";
          });
          setStorageData(mapped);
        } catch (error) {
          console.error("Failed to load user data", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, [])
  );

  // Manual refresh function
  const refreshUserData = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem("userInfo");
      if (storedData) {
        setUser(JSON.parse(storedData));
      }

      // Refresh storage values too
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);
      const mapped: Record<string, string> = {};
      entries.forEach(([key, value]) => {
        mapped[key] = value ?? "";
      });
      setStorageData(mapped);
    } catch (error) {
      console.error("Failed to refresh user data", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  }, []);
interface MenuItemProps {
  iconName: string;
  menuItemName: string;
  onPress: () => void;
  componentName?: "Ionicons" | "MaterialIcons"; // optional, defaults to Ionicons
}

const menuItems: MenuItemProps[] = [
  {
    iconName: "business-outline",
    componentName: "Ionicons",
    menuItemName: "Manage Organisation",
    onPress: () => router.push("/(tabs)/profile/manageOrganisation"),
  },
  {
    iconName: "language-outline",
    componentName: "Ionicons",
    menuItemName: "Select Language",
    onPress: () => router.push("/(tabs)/profile/changePassword"),
  },
  {
    iconName: "notifications-outline",
    componentName: "Ionicons",
    menuItemName: "Manage Notification",
    onPress: async () => {
      try {
        await Linking.openSettings();
      } catch (error) {
        console.error("Failed to open settings:", error);
      }
    },
  },
  {
    iconName: "color-palette-outline",
    componentName: "Ionicons",
    menuItemName: "Theme Settings",
    onPress: () => {
      router.push("/(tabs)/profile/themeSettings");
    },
  },
  {
    iconName: "password",
    componentName: "MaterialIcons", // ✅ matches union type
    menuItemName: "Password",
    onPress: () => {
      router.push("/(tabs)/profile/changePassword");
    },
  },
];



  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#9333ea" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Gradient Header */}
        <LinearGradient
          colors={["#9333ea", "#4f46e5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientHeader}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                router.push("/(tabs)/profile/editProfile");
              }}
            >
              <Feather name="edit" color="#fff" size={22} />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    user?.profilePic ||
                    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
                }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.name}>
              {user ? `${user.fName} ${user.lName}` : "Guest User"}
            </Text>
            <Text style={styles.email}>
              {user?.email || "No email available"}
            </Text>
          </View>
        </LinearGradient>

        {/* Content Container */}
        <View
          style={[
            styles.contentContainer,
            {
              backgroundColor: theme.background,
            },
          ]}
        >
          <Text style={[styles.contentLabel, { color: theme.text }]}>
            CONTENT
          </Text>

          <Menu items={menuItems} />

          {/* Change Password Section */}
          <View style={styles.passwordBox}>
            <Text style={styles.passwordTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="New password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#888"
            />
            {passwordMessage ? (
              <Text style={styles.passwordMessage}>{passwordMessage}</Text>
            ) : null}
            <TouchableOpacity
              style={[styles.updateBtn, isUpdatingPassword && { opacity: 0.6 }]}
              disabled={isUpdatingPassword}
              onPress={async () => {
                try {
                  setIsUpdatingPassword(true);
                  setPasswordMessage(null);
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    setPasswordMessage("All fields are required");
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    setPasswordMessage("New password and confirm do not match");
                    return;
                  }
                  const res = await updatePasswordRequest({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                  });
                  if (res?.success) {
                    setPasswordMessage("Password updated successfully");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  } else {
                    setPasswordMessage(
                      res?.message || "Failed to update password"
                    );
                  }
                } catch (error: any) {
                  setPasswordMessage(
                    error?.message || "Failed to update password"
                  );
                } finally {
                  setIsUpdatingPassword(false);
                }
              }}
            >
              <Text style={styles.updateBtnText}>
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🔹 AsyncStorage Debug Box */}
          <View style={styles.debugBox}>
            <Text style={styles.debugTitle}>AsyncStorage Data:</Text>
            {Object.entries(storageData).map(([key, value]) => (
              <Text key={key} style={styles.debugText}>
                {key}: {value}
              </Text>
            ))}
          </View>

          <View style={{ flex: 1 }} />
          <LogoutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9333ea",
  },
  gradientHeader: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingBottom: 0,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: "white",
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 15,
  },
  debugBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "rgba(147, 51, 234, 0.1)", // subtle purple background
    borderRadius: 12,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    color: "#9333ea",
  },
  debugText: {
    fontSize: 12,
    color: "#444",
    marginBottom: 4,
  },
  passwordBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  updateBtn: {
    height: 46,
    backgroundColor: "#9333ea",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  updateBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  passwordMessage: {
    color: "#6b7280",
    marginBottom: 8,
  },
});

export default ProfilePage;
