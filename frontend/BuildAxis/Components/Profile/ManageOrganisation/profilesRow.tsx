import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "@/context/ThemeContext";

interface Profile {
  name: string;
  imgUrl?: string;
  data?: any; // Optional data property to hold the full object
}

interface ProfilesRowProps {
  rowTitle: string;
  profiles: Profile[];
  onViewAll?: () => void;
  onAddNew?: () => void;
  onProfilePress?: (profile: Profile, index: number) => void;
  showDivider?: boolean;
}

// Lazy Loading Image Component
const LazyImage: React.FC<{
  source: { uri: string };
  style: any;
  resizeMode: "cover" | "contain" | "stretch" | "repeat" | "center";
}> = ({ source, style, resizeMode }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error) {
    return (
      <View style={[style, styles.fallbackAvatar]}>
        <Icon name="user" size={32} color="#6b7280" />
      </View>
    );
  }

  return (
    <View style={style}>
      {loading && (
        <View style={[style, styles.loadingOverlay]}>
          <ActivityIndicator size="small" color="#6b7280" />
        </View>
      )}
      <Image
        source={source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
      />
    </View>
  );
};

const ProfilesRow: React.FC<ProfilesRowProps> = ({
  rowTitle,
  profiles,
  onViewAll,
  onAddNew,
  onProfilePress,
  showDivider = true,
}) => {
  const { theme } = useTheme();

  // Get first letter of name for fallback avatar
  const getInitial = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Show first 6 profiles + add button, or all profiles if less than 6
  const displayProfiles = profiles.slice(0, 6);
  const showAddButton = true; // Always show add button
  const remainingCount = profiles.length - 6;

  const renderProfile = (profile: Profile, index: number) => (
    <TouchableOpacity
      key={`profile-${index}`}
      style={styles.profileContainer}
      onPress={() => onProfilePress?.(profile, index)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.avatarContainer,
          {
            backgroundColor: theme.listItemFill,
            borderColor: theme.listItemBorder,
          },
        ]}
      >
        {profile.imgUrl ? (
          <LazyImage
            source={{ uri: profile.imgUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.fallbackAvatar,
              { backgroundColor: theme.listItemFill },
            ]}
          >
            <Icon name="user" size={32} color={theme.icons} />
          </View>
        )}
      </View>
      <Text
        style={[styles.profileName, { color: theme.text }]}
        numberOfLines={1}
      >
        {profile.name}
      </Text>
    </TouchableOpacity>
  );

  const renderAddButton = () => (
    <TouchableOpacity
      style={styles.profileContainer}
      onPress={onAddNew}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.avatarContainer,
          styles.addButtonContainer,
          {
            backgroundColor: theme.listItemFill,
            borderColor: theme.listItemBorder,
          },
        ]}
      >
        <Icon name="plus" size={32} color={theme.icons} />
      </View>
      <Text style={[styles.addButtonText, { color: theme.icons }]}>Add</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header with title and view all */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{rowTitle}</Text>
          {profiles.length > 6 && (
            <TouchableOpacity
              onPress={onViewAll}
              activeOpacity={0.7}
              style={[
                styles.viewAllButton,
                {
                  backgroundColor: theme.listItemFill,
                  borderColor: theme.listItemBorder,
                },
              ]}
            >
              <Text style={styles.viewAllText}>
                View All ({remainingCount}+)
              </Text>
              <Icon name="chevron-right" size={16} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </View>

        {/* Profiles grid */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          decelerationRate="fast"
          snapToInterval={96} // Width + gap for smooth scrolling
        >
          <View style={styles.profilesGrid}>
            {displayProfiles.map((profile, index) =>
              renderProfile(profile, index)
            )}
            {showAddButton && renderAddButton()}
          </View>
        </ScrollView>
      </View>

      {/* Horizontal divider line */}
      {showDivider && (
        <View
          style={[styles.divider, { backgroundColor: theme.listItemBorder }]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  viewAllText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
    marginRight: 4,
  },
  scrollContainer: {
    paddingRight: 16,
  },
  profilesGrid: {
    flexDirection: "row",
    gap: 16,
  },
  profileContainer: {
    alignItems: "center",
    width: 90,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    // Enhanced shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  fallbackAvatar: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  loadingOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    zIndex: 1,
  },
  addButtonContainer: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 12,
  },
  profileName: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
    maxWidth: 85,
    lineHeight: 18,
  },
  addButtonText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 8,
  },
});

export default ProfilesRow;
