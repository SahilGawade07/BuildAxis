import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface Profile {
  name: string;
  imgUrl?: string;
}

interface OwnersSectionProps {
  rowTitle: string;
  profiles: Profile[];
  onViewAll?: () => void;
  onAddNew?: () => void;
  onProfilePress?: (profile: Profile, index: number) => void;
}

const OwnersSection: React.FC<OwnersSectionProps> = ({
  rowTitle,
  profiles,
  onViewAll,
  onAddNew,
  onProfilePress,
}) => {
  // Get first letter of name for fallback avatar
  const getInitial = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Show first 6 profiles + add button, or all profiles if less than 7
  const displayProfiles = profiles.slice(0, 6);
  const showAddButton = profiles.length < 7;

  const renderProfile = (profile: Profile, index: number) => (
    <TouchableOpacity
      key={`profile-${index}`}
      style={styles.profileContainer}
      onPress={() => onProfilePress?.(profile, index)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {profile.imgUrl ? (
          <Image
            source={{ uri: profile.imgUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.fallbackAvatar}>
            <Icon name="user" size={24} color="#6b7280" />
          </View>
        )}
      </View>
      <Text style={styles.profileName} numberOfLines={1}>
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
      <View style={[styles.avatarContainer, styles.addButtonContainer]}>
        <Icon name="plus" size={24} color="#6b7280" />
      </View>
      <Text style={styles.addButtonText}>Add</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with title and view all */}
      <View style={styles.header}>
        <Text style={styles.title}>{rowTitle}</Text>
        {profiles.length > 6 && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profiles grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.profilesGrid}>
          {displayProfiles.map((profile, index) =>
            renderProfile(profile, index)
          )}
          {showAddButton && renderAddButton()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  viewAllText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
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
    width: 80,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  fallbackAvatar: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  addButtonContainer: {
    backgroundColor: "#f9fafb",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  profileName: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
  },
  addButtonText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
});

export default OwnersSection;

// Usage example:
/*
const sampleProfiles: Profile[] = [
  { name: 'sahil', imgUrl: 'https://example.com/sahil.jpg' },
  { name: 'Shraddha' },
  { name: 'siddharth', imgUrl: 'https://example.com/siddharth.jpg' },
  { name: 'Priy' },
  { name: 'John', imgUrl: 'https://example.com/john.jpg' },
  { name: 'Alice' },
  { name: 'Bob' },
];

<OwnersSection
  rowTitle="Owners"
  profiles={sampleProfiles}
  onViewAll={() => console.log('View all pressed')}
  onAddNew={() => console.log('Add new pressed')}
  onProfilePress={(profile, index) => console.log(`Profile ${profile.name} at index ${index} pressed`)}
/>
*/
