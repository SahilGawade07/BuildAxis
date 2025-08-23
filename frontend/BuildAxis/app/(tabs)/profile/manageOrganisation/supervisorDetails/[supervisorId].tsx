import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryBtn from "@/components/ui/primaryBtn";

interface SupervisorData {
  _id: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  profilePic?: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
}

export default function SupervisorDetails() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const supervisorId = params.supervisorId as string;
  const supervisorName = params.name as string;
  const profilePicUrl = params.profilePicUrl as string;

  const [supervisor, setSupervisor] = useState<SupervisorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supervisorId) {
      fetchSupervisorDetails();
    }
  }, [supervisorId]);

  const fetchSupervisorDetails = async () => {
    try {
      setLoading(true);
      // For now, we'll use the data passed via params
      // In a real app, you'd fetch from API using supervisorId
      const mockSupervisor: SupervisorData = {
        _id: supervisorId,
        fName: supervisorName?.split(' ')[0] || 'Supervisor',
        lName: supervisorName?.split(' ').slice(1).join(' ') || '',
        email: 'supervisor@example.com', // This would come from API
        phone: '+1234567890', // This would come from API
        profilePic: profilePicUrl,
        orgId: 'org123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setSupervisor(mockSupervisor);
    } catch (error) {
      console.error('Error fetching supervisor details:', error);
      Alert.alert('Error', 'Failed to load supervisor details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSupervisor = () => {
    // Navigate to edit supervisor page
    router.push({
      pathname: "/profile/manageOrganisation/editSupervisor",
      params: { supervisorId, name: supervisorName, profilePicUrl }
    });
  };

  const handleDeleteSupervisor = () => {
    Alert.alert(
      'Delete Supervisor',
      'Are you sure you want to delete this supervisor? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle delete logic here
            Alert.alert('Success', 'Supervisor deleted successfully');
            router.back();
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <HeaderBar title="Supervisor Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!supervisor) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <HeaderBar title="Supervisor Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>
            Supervisor not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar title="Supervisor Details" />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.secondary }]}>
          <View style={styles.profileImageContainer}>
            {supervisor.profilePic ? (
              <Image 
                source={{ uri: supervisor.profilePic }} 
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.defaultProfileImage, { backgroundColor: theme.primary }]}>
                <Ionicons name="person" size={60} color={theme.text} />
              </View>
            )}
          </View>
          <Text style={[styles.supervisorName, { color: theme.text }]}>
            {supervisor.fName} {supervisor.lName}
          </Text>
          <Text style={[styles.supervisorRole, { color: theme.text }]}>
            Supervisor
          </Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Personal Information
          </Text>

          <View style={[styles.detailCard, { backgroundColor: theme.listItemFill }]}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>Full Name</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {supervisor.fName} {supervisor.lName}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>Email</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {supervisor.email}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>Phone</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {supervisor.phone}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.icons} />
              <Text style={[styles.detailLabel, { color: theme.text }]}>Joined</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {new Date(supervisor.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Actions
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={handleEditSupervisor}
            >
              <Ionicons name="create-outline" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>
                Edit Supervisor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.secondary }]}
              onPress={() => {
                // Handle view tasks/assignments
                Alert.alert('Info', 'View tasks functionality coming soon');
              }}
            >
              <Ionicons name="list-outline" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>
                View Tasks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
              onPress={handleDeleteSupervisor}
            >
              <Ionicons name="trash-outline" size={20} color="white" />
              <Text style={[styles.actionButtonText, { color: 'white' }]}>
                Delete Supervisor
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <PrimaryBtn
            text="Back to Manage Organisation"
            onPress={handleBack}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supervisorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  supervisorRole: {
    fontSize: 16,
    opacity: 0.8,
  },
  detailsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailCard: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButtons: {
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonContainer: {
    paddingHorizontal: 20,
  },
});
