import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
} from "react-native";
import {
  Entypo,
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTaskDetails } from "@/lib/api";
import { Task } from "@/types/task";
import { CompanyBar } from "@/components/ui/orgNameBar";
import HeaderBar from "@/components/ui/headerBar";

export default function TaskDetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { taskId, siteName } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await getTaskDetails(taskId as string);

      if (response.success && response.data) {
        setTask(response.data);
      } else {
        setError(response.message || "Failed to fetch task details");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch task details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "verified":
        return theme.success;
      case "in_progress":
        return theme.onging;
      case "cancelled":
        return theme.error;
      case "closed":
        return theme.muted;
      default:
        return theme.primary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "verified":
        return "Verified";
      case "closed":
        return "Closed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#FF4444";
      case "high":
        return "#FF8800";
      case "medium":
        return "#FFBB33";
      case "low":
        return "#00C851";
      default:
        return theme.muted;
    }
  };

  const getPriorityText = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOpenAttachment = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open attachment");
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <HeaderBar title="Task Details" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading task details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !task) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <HeaderBar title="Task Details" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.error} />
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            Error Loading Task
          </Text>
          <Text style={[styles.errorText, { color: theme.muted }]}>
            {error || "Task not found"}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={fetchTaskDetails}
          >
            <Text style={[styles.retryButtonText, { color: theme.background }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title={task.title} />

      {/* Progress Section */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: theme.muted }]}>
              Progress
            </Text>
            <Text style={[styles.progressText, { color: theme.text }]}>
              {task.progress || 0}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${task.progress || 0}%`,
                  backgroundColor: getStatusColor(task.status),
                },
              ]}
            />
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(task.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(task.status) },
              ]}
            >
              {getStatusText(task.status)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Info Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Task Information
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.muted} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>
                Due Date
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {formatDate(task.due)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={theme.muted} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>
                Created
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {formatDate(task.createdAt)} at {formatTime(task.createdAt)}
              </Text>
            </View>
          </View>

          {task.description && (
            <View style={styles.infoRow}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={theme.muted}
              />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.muted }]}>
                  Description
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {task.description}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={theme.muted} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.muted }]}>
                Created By
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {task.createdBy?.fName} {task.createdBy?.lName}
              </Text>
            </View>
          </View>
        </View>

        {/* Assigned People Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Assigned People
          </Text>

          {task.assignedToSupervisors &&
            task.assignedToSupervisors.length > 0 && (
              <View style={styles.peopleGroup}>
                <Text style={[styles.peopleGroupTitle, { color: theme.muted }]}>
                  Supervisors ({task.assignedToSupervisors.length})
                </Text>
                {task.assignedToSupervisors.map((supervisor, index) => (
                  <View key={index} style={styles.personItem}>
                    <View
                      style={[
                        styles.personAvatar,
                        { backgroundColor: theme.primary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.personInitial,
                          { color: theme.background },
                        ]}
                      >
                        {supervisor.fName.charAt(0)}
                        {supervisor.lName.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.personInfo}>
                      <Text style={[styles.personName, { color: theme.text }]}>
                        {supervisor.fName} {supervisor.lName}
                      </Text>
                      {supervisor.email && (
                        <Text
                          style={[styles.personDetail, { color: theme.muted }]}
                        >
                          {supervisor.email}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

          {task.assignedToLabourers && task.assignedToLabourers.length > 0 && (
            <View style={styles.peopleGroup}>
              <Text style={[styles.peopleGroupTitle, { color: theme.muted }]}>
                Labourers ({task.assignedToLabourers.length})
              </Text>
              {task.assignedToLabourers.map((labourer, index) => (
                <View key={index} style={styles.personItem}>
                  <View
                    style={[
                      styles.personAvatar,
                      { backgroundColor: theme.secondary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.personInitial,
                        { color: theme.background },
                      ]}
                    >
                      {labourer.fName.charAt(0)}
                      {labourer.lName.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.personInfo}>
                    <Text style={[styles.personName, { color: theme.text }]}>
                      {labourer.fName} {labourer.lName}
                    </Text>
                    {labourer.phone && (
                      <Text
                        style={[styles.personDetail, { color: theme.muted }]}
                      >
                        {labourer.phone}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {(!task.assignedToSupervisors ||
            task.assignedToSupervisors.length === 0) &&
            (!task.assignedToLabourers ||
              task.assignedToLabourers.length === 0) && (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color={theme.muted} />
                <Text style={[styles.emptyText, { color: theme.muted }]}>
                  No people assigned to this task
                </Text>
              </View>
            )}
        </View>

        {/* Materials Section */}
        {task.materials && task.materials.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Materials Required
            </Text>
            {task.materials.map((material, index) => (
              <View key={index} style={styles.materialItem}>
                <View style={styles.materialInfo}>
                  <Text style={[styles.materialName, { color: theme.text }]}>
                    {material.name}
                  </Text>
                  <Text
                    style={[styles.materialQuantity, { color: theme.muted }]}
                  >
                    {material.quantity} {material.unit}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Inventory Used Section */}
        {task.inventoryUsed && task.inventoryUsed.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Inventory Used
            </Text>
            {task.inventoryUsed.map((item, index) => (
              <View key={index} style={styles.inventoryItem}>
                <View style={styles.inventoryInfo}>
                  <Text style={[styles.inventoryName, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.inventoryQuantity, { color: theme.muted }]}
                  >
                    {item.quantity} {item.unit}
                  </Text>
                  {item.specification && (
                    <Text
                      style={[styles.inventorySpec, { color: theme.muted }]}
                    >
                      {item.specification}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Images Section */}
        {task.images && task.images.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Images ({task.images.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {task.images.map((imageUrl, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageContainer}
                  onPress={() => handleOpenAttachment(imageUrl)}
                >
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Attachments Section */}
        {task.attachments && task.attachments.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Attachments ({task.attachments.length})
            </Text>
            {task.attachments.map((attachmentUrl, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.attachmentItem,
                  { borderColor: theme.listItemBorder },
                ]}
                onPress={() => handleOpenAttachment(attachmentUrl)}
              >
                <MaterialIcons
                  name="attach-file"
                  size={24}
                  color={theme.primary}
                />
                <View style={styles.attachmentInfo}>
                  <Text style={[styles.attachmentName, { color: theme.text }]}>
                    Attachment {index + 1}
                  </Text>
                  <Text style={[styles.attachmentUrl, { color: theme.muted }]}>
                    {attachmentUrl.split("/").pop() || "Document"}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={20} color={theme.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  siteName: {
    fontSize: 14,
    fontWeight: "400",
  },
  headerActions: {
    alignItems: "flex-end",
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  progressSection: {
    marginTop: 8,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "400",
  },
  peopleGroup: {
    marginBottom: 20,
  },
  peopleGroupTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  personItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  personInitial: {
    fontSize: 16,
    fontWeight: "600",
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  personDetail: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  materialItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  materialQuantity: {
    fontSize: 12,
  },
  inventoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  inventoryQuantity: {
    fontSize: 12,
    marginBottom: 2,
  },
  inventorySpec: {
    fontSize: 11,
    fontStyle: "italic",
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  attachmentUrl: {
    fontSize: 12,
  },
});
