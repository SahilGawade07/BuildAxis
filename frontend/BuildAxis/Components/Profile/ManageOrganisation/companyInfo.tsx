import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../../../context/ThemeContext";

interface CompanyInfoCardProps {
  imageUrl?: string;
  organizationName: string;
  address: string;
  onEdit?: () => void;
}

// Lazy Loading Image Component for Company Logo
const LazyCompanyImage: React.FC<{
  source: { uri: string };
  style: any;
  fallbackStyle: any;
  organizationName: string;
  theme: any;
}> = ({ source, style, fallbackStyle, organizationName, theme }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const getInitial = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : "O";
  };

  if (error) {
    return (
      <View style={fallbackStyle}>
        <Text style={[styles.initialText, { color: "#ffffff" }]}>
          {getInitial(organizationName)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.imageContainer}>
      {loading && (
        <View style={[style, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}
      <Image
        source={source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        resizeMode="cover"
        onLoad={handleLoad}
        onError={handleError}
      />
    </View>
  );
};

export const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({
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
      {/* Main content container */}
      <View style={styles.contentContainer}>
        {/* Left side with profile and info */}
        <View style={styles.leftContainer}>
          {/* Profile picture */}
          <View style={styles.profileContainer}>
            {imageUrl ? (
              <LazyCompanyImage
                source={{ uri: imageUrl }}
                style={styles.profileImage}
                fallbackStyle={[
                  styles.fallbackProfile,
                  { backgroundColor: theme.primary },
                ]}
                organizationName={organizationName}
                theme={theme}
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
            <View style={styles.addressContainer}>
              <Icon
                name="map-pin"
                size={16}
                color={theme.icons}
                style={styles.locationIcon}
              />
              <Text
                style={[styles.address, { color: theme.icons }]}
                numberOfLines={3}
              >
                {address || "No address provided"}
              </Text>
            </View>
          </View>
        </View>

        {/* Right side with edit button */}
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: theme.listItemFill }]}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Icon name="edit-2" size={24} color={theme.activeTabIcon} />
        </TouchableOpacity>
      </View>

      {/* Bottom divider */}
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingBottom: 8,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileContainer: {
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  imageContainer: {
    position: "relative",
  },
  loadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 36,
    zIndex: 1,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  fallbackProfile: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  initialText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 12,
  },
  organizationName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  address: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 20,
    flex: 1,
    fontWeight: "400",
  },
  editButton: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
});
