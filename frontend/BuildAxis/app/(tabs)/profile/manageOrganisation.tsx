import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import CompanyInfoCard from "@/components/Profile/ManageOrganisation/companyInfo";
import OwnersSection from "@/components/Profile/ManageOrganisation/profilesRow";

export default function ManageOrganization() {
  const { theme } = useTheme();

  // Fixed sample profiles data structure for OwnersSection
  const sampleProfiles = [
    {
      name: "sahil",
      imgUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Shraddha",
      imgUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b612b65c?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "siddharth",
      imgUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Priy",
      imgUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "John",
      imgUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Alice",
      imgUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Bob",
      imgUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Sample profiles for other sections (Supervisors, Labours, Vendors)
  const supervisorProfiles = [
    {
      name: "Alex",
      imgUrl:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Maya",
      imgUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "David",
      imgUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const labourProfiles = [
    {
      name: "Raj",
      imgUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Amit",
      imgUrl:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
    },
    { name: "Vikram" }, // No image URL - will show fallback
    { name: "Suresh" }, // No image URL - will show fallback
  ];

  const vendorProfiles = [
    {
      name: "Steel Co.",
      imgUrl:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop&crop=center",
    },
    { name: "Cement Ltd." }, // No image URL - will show fallback
    { name: "Paint Corp." }, // No image URL - will show fallback
  ];

  const roles = [
    { title: "Supervisors", profiles: supervisorProfiles },
    { title: "Labours", profiles: labourProfiles },
    { title: "Vendors", profiles: vendorProfiles },
  ];

  // Example profile data (no images, just names) - keeping for fallback
  const mockProfiles = [
    { id: 1, name: "sahil" },
    { id: 2, name: "Shraddha" },
    { id: 3, name: "siddharth" },
    { id: 4, name: "Priya" },
  ];

  const renderProfileSection = (title: string, profiles: any[]) => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {title}
        </Text>
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
                  style={[
                    styles.iconCircle,
                    { backgroundColor: theme.secondary + "22" },
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={28}
                    color={theme.icons}
                  />
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
            <View
              style={[
                styles.squareBorder,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text style={[styles.addButtonText, { color: theme.icons }]}>
                +
              </Text>
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
      <HeaderBar title="Manage Organisation" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <CompanyInfoCard
          imageUrl="https://static.vecteezy.com/system/resources/thumbnails/008/998/006/small/url-logo-url-letter-url-letter-logo-design-initials-url-logo-linked-with-circle-and-uppercase-monogram-logo-url-typography-for-technology-business-and-real-estate-brand-vector.jpg"
          organizationName="MK Counstructions"
          address="Charholi, Kaljewadi, Pune -39"
        />

        {/* Using the new OwnersSection component */}
        <OwnersSection
          rowTitle="Owners"
          profiles={sampleProfiles}
          onViewAll={() => console.log("View all owners pressed")}
          onAddNew={() => console.log("Add new owner pressed")}
          onProfilePress={(profile, index) =>
            console.log(`Owner ${profile.name} at index ${index} pressed`)
          }
        />

        {/* Other role sections using the new component */}
        {roles.map((role) => (
          <OwnersSection
            key={role.title}
            rowTitle={role.title}
            profiles={role.profiles}
            onViewAll={() =>
              console.log(`View all ${role.title.toLowerCase()} pressed`)
            }
            onAddNew={() =>
              console.log(
                `Add new ${role.title.toLowerCase().slice(0, -1)} pressed`
              )
            }
            onProfilePress={(profile, index) =>
              console.log(
                `${role.title} ${profile.name} at index ${index} pressed`
              )
            }
          />
        ))}

        {/* Fallback - keeping original renderProfileSection for comparison */}
        {/* You can remove this section once you're satisfied with OwnersSection */}
        {/*
        {roles.map((role) => renderProfileSection(role.title, mockProfiles))}
        */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, // Fixed: was flex: 2

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
    borderColor: "#999", // <-- gray color for all square borders
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
