import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Linking } from "react-native";
import Menu from "@/components/Profile/MenuList";
import LogoutButton from "@/components/Profile/LogoutBtn";
import { router } from "expo-router";

// Define the type for a single menu item
interface MenuItem {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  menuItemName: string;
  onPress: () => void;
}

// Menu items with real icon names from Ionicons
const menuItems: MenuItem[] = [
  {
    iconName: "business-outline",
    menuItemName: "Manage Organisation",
    onPress: () => console.log("Manage Organisation pressed"),
  },
  {
    iconName: "language-outline",
    menuItemName: "Select Language",
    onPress: () => console.log("Select Language pressed"),
  },
  {
    iconName: "notifications-outline",
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
    menuItemName: "Theme Settings",
    onPress: () => {
      router.push("/(tabs)/profile/themeSettings");
    },
  },
];

const ProfilePage = () => {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://via.placeholder.com/80x80/4ade80/ffffff?text=MS",
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>Kunal Sunil Mohite</Text>
          <Text style={styles.email}>kunal@gmail.com</Text>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentLabel}>CONTENT</Text>

          {/* Menu Items */}
          <Menu items={menuItems} />

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
    backgroundColor: "#6366f1",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "300",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    paddingBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4ade80",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  contentLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 15,
  },
});

export default ProfilePage;
