import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { Task } from "@/types/task";
import { useRouter } from "expo-router";

interface TaskListProps {
  tasks: Task[];
  onRefresh: () => void;
}

export default function TaskList({ tasks, onRefresh }: TaskListProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefreshHandler = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAssignedPeople = (task: Task) => {
    const supervisors = task.assignedToSupervisors?.length || 0;
    const labourers = task.assignedToLabourers?.length || 0;

    if (supervisors === 0 && labourers === 0) {
      return "Unassigned";
    }

    let result = "";
    if (supervisors > 0) {
      result += `${supervisors} supervisor${supervisors > 1 ? "s" : ""}`;
    }
    if (labourers > 0) {
      if (result) result += ", ";
      result += `${labourers} labourer${labourers > 1 ? "s" : ""}`;
    }
    return result;
  };

  const handleTaskPress = (task: Task) => {
    router.push(
      `/sites/${
        task.site?.name ? encodeURIComponent(task.site.name) : "unknown"
      }/taskDetails/${task._id}?taskId=${task._id}`
    );
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          shadowColor: theme.shadow,
          borderColor: theme.listItemBorder,
          borderWidth: 1,
        },
      ]}
      activeOpacity={0.7}
      onPress={() => handleTaskPress(item)}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.siteName, { color: theme.muted }]}>
            {item.site?.name || "Unknown Site"}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Text style={styles.priorityText}>
              {getPriorityText(item.priority)}
            </Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Entypo name="dots-three-vertical" size={16} color={theme.muted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status and Progress Row */}
      <View style={styles.statusRow}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusLabel, { color: theme.muted }]}>
            Status
          </Text>
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={[styles.progressLabel, { color: theme.muted }]}>
            Progress
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${item.progress || 0}%`,
                  backgroundColor: getStatusColor(item.status),
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.text }]}>
            {item.progress || 0}%
          </Text>
        </View>
      </View>

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <View style={styles.assignedContainer}>
          <Ionicons name="people-outline" size={14} color={theme.muted} />
          <Text
            style={[styles.assignedText, { color: theme.muted }]}
            numberOfLines={1}
          >
            {getAssignedPeople(item)}
          </Text>
        </View>

        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color={theme.muted} />
          <Text style={[styles.dateText, { color: theme.muted }]}>
            Due: {formatDate(item.due)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={theme.muted} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Tasks Found
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
        Create your first task to get started
      </Text>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshHandler}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
      ListEmptyComponent={renderEmptyState}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  siteName: {
    fontSize: 13,
    fontWeight: "400",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  menuButton: {
    padding: 4,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginRight: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 30,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignedContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  assignedText: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
