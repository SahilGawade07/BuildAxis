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

  // Fetch user data from AsyncStorage - This will run every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const storedData = await AsyncStorage.getItem("userInfo");
          if (storedData) {
            setUser(JSON.parse(storedData));
          }
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
    } catch (error) {
      console.error("Failed to refresh user data", error);
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh callback
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshUserData();
    setRefreshing(false);
  }, []);

  const menuItems: MenuItem[] = [
    {
      iconName: "business-outline",
      menuItemName: "Manage Organisation",
      onPress: () => router.push("/(tabs)/profile/manageOrganisation"),
    },
    {
      iconName: "language-outline",
      menuItemName: "Select Language",
      onPress: () =>  router.push("/(tabs)/profile/language"),
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
     {
      iconName: "color-palette-outline",
      menuItemName: "site map",
      onPress: () => {
        router.push("/_sitemap");
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
    justifyContent: "flex-end", // 🔹 Pushes edit icon to the right
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)", // subtle circle background
    borderRadius: 20,
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
});

export default ProfilePage;
