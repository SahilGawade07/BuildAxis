import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../../../context/ThemeContext";

interface CompanyInfoCardProps {
  imageUrl?: string;
  organizationName: string;
  address: string;
  onEdit?: () => void;
}

const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({
  imageUrl,
  organizationName,
  address,
  onEdit,
}) => {
  const { theme } = useTheme();

  // Function to get first letter of organization name for fallback
  const getInitial = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : "O";
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Left side with profile and info */}
      <View style={styles.leftContainer}>
        {/* Profile picture */}
        <View style={styles.profileContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.fallbackProfile,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={styles.initialText}>
                {getInitial(organizationName)}
              </Text>
            </View>
          )}
        </View>

        {/* Organization info */}
        <View style={styles.infoContainer}>
          <Text
            style={[styles.organizationName, { color: theme.text }]}
            numberOfLines={1}
          >
            {organizationName}
          </Text>
          <Text
            style={[styles.address, { color: theme.icons }]}
            numberOfLines={2}
          >
            {address}
          </Text>
        </View>
      </View>

      {/* Right side with edit button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        <Icon name="edit-2" size={20} color={theme.icons} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  fallbackProfile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f97316", // Orange color
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  infoContainer: {
    flex: 1,
    paddingRight: 8,
  },
  organizationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
});

export default CompanyInfoCard;

// Usage example:
/*
<CompanyInfoCard
  imageUrl="https://example.com/profile.jpg"
  organizationName="Buildaxis"
  address="123 Construction Ave, Building City, 12345"
  onEdit={() => console.log('Edit pressed')}
/>

// Without image (will show fallback with first letter)
<CompanyInfoCard
  organizationName="Buildaxis"
  address="123 Construction Ave, Building City, 12345"
  onEdit={() => console.log('Edit pressed')}
/>
*/
