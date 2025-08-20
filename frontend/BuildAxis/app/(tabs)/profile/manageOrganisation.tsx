import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Safe_area } from "@/components/ui/safeArea";
import { useTheme } from "@/context/ThemeContext";
import Back_Text_Butt from "@/components/ui/backBtn";
import { CompanyBar } from "@/components/ui/orgNameBar";

export default function ManageOrganization() {
  const { theme } = useTheme();

  const roles = [
    { title: "Owners" },
    { title: "Supervisors" },
    { title: "Labours" },
    { title: "Vendors" },
  ];

  // Example profile data (no images, just names)
  const mockProfiles = [
    { id: 1, name: "sahil" },
    { id: 2, name: "Shraddha" },
    { id: 3, name: "siddharth" },
    { id: 4, name: "Priya" },
  ];

  const renderProfileSection = (title: string, profiles: any[]) => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.profileScrollContainer}
        >
          {profiles.map((profile, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.profileCard,
                {
                  borderColor: theme.listItemBorder,
                  backgroundColor: theme.listItemFill,
                },
              ]}
            >
              {/* Square border wrapper */}
              <View style={styles.squareBorder}>
                {/* Circular icon inside square */}
                <View
                  style={[styles.iconCircle, { backgroundColor: theme.secondary + "22" }]}
                >
                  <Ionicons name="person-outline" size={28} color={theme.icons} />
                </View>
              </View>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {profile.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Add button with square style */}
          <TouchableOpacity
            style={[
              styles.profileCard,
              {
                borderColor: theme.listItemBorder,
                backgroundColor: theme.listItemFill,
              },
            ]}
          >
            <View style={[styles.squareBorder, { justifyContent: "center", alignItems: "center" }]}>
              <Text style={[styles.addButtonText, { color: theme.icons }]}>+</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <Safe_area />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <CompanyBar />
        <Back_Text_Butt path="/tabs/Sites/Site" text="Manage Organization" />

        {/* Banner + Floating Logo */}
        <View style={{ height: 200, marginBottom: 40 }}>
          <Image
            source={require("@/assets/images/Construction.png")}
            style={{ width: "100%", height: "100%", borderRadius: 6 }}
          />
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/logo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.plusIcon}>
              <FontAwesome6 name="add" size={16} color="#1976D2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role Sections */}
        {roles.map((role) => renderProfileSection(role.title, mockProfiles))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  logoWrapper: {
    position: "absolute",
    bottom: -30,
    left: 20,
    backgroundColor: "#e3f2fd",
    borderRadius: 50,
    padding: 8,
    elevation: 4,
    shadowColor: "#0e0e0eff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  plusIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#fff",
    borderRadius: 18,
    height: 28,
    width: 28,
    borderWidth: 2,
    borderColor: "#3871adff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  sectionContainer: {
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  profileScrollContainer: {
    paddingRight: 20,
    alignItems: "center",
  },
  profileCard: {
    width: 80,
    alignItems: "center",
    marginRight: 15,
  },
  squareBorder: {
    width: 75,
    height: 90,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "#d0cacaff", 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  addButtonText: {
    fontSize: 26,
    fontWeight: "300",
  },
});
