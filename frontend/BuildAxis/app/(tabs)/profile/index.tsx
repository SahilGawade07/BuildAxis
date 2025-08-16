import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Menu from "@/components/Profile/MenuList";
import LogoutButton from "@/components/Profile/LogoutBtn";
import { router } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";

interface MenuItem {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  menuItemName: string;
  onPress: () => void;
}

const ProfilePage = () => {
  const { theme } = useTheme();

  const menuItems: MenuItem[] = [
    {
      iconName: "business-outline",
      menuItemName: "Manage Organisation",
      onPress: () => console.log("Manage Organisation pressed"),
    },
    {
      iconName: "language-outline",
      menuItemName: "Select Language",
      onPress: () => router.push("/(tabs)/profile/themeSetting"),
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Gradient Header */}
        <LinearGradient
          colors={["#9333ea", "#4f46e5"]} // purple-600 to indigo-600
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientHeader}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.headerButtonText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.headerButtonText}>⋮</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: "https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250w",
                }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.name}>Kunal Sunil Mohite</Text>
            <Text style={styles.email}>kunal@gmail.com</Text>
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
    backgroundColor: "#9333ea", // Fallback color
  },
  gradientHeader: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "300",
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
    color: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
  },
  contentContainer: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20, // Overlap with gradient header
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 15,
  },
});

export default ProfilePage;
