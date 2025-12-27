import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Safe_area } from "@/components/ui/safeArea";
import { CompanyBar } from "@/components/ui/orgNameBar";
import AttendancaceBox from "@/components/ui/attandanceBox";
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import MaterialsScreen from "@/components/Sites/tasks/attachmentScreen";
import ImageScreen from "@/components/Sites/tasks/ImageScreen";
import CircularProgress from "@/components/Sites/tasks/common/circleprgressbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTaskDetails } from "@/lib/api";
import { Task } from "@/types/task";

export default function TaskDetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { taskId, siteName } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const members = [
    { id: 1, img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 3, img: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 4, img: "https://randomuser.me/api/portraits/women/45.jpg" },
  ];

  const [active, setActive] = useState("Images");
  const [page, setPage] = useState("Assign Task");

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  useEffect(() => {
    setPage(active);
  }, [active]);

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

  const getAssignedPeopleCount = () => {
    const supervisors = task?.assignedToSupervisors?.length || 0;
    const labourers = task?.assignedToLabourers?.length || 0;
    return supervisors + labourers;
  };

  const getAttachmentsCount = () => {
    const images = task?.images?.length || 0;
    const attachments = task?.attachments?.length || 0;
    return images + attachments;
  };

  const renderPageContent = () => {
    switch (page) {
      case "Images":
        return <ImageScreen />;
      case "Labours":
        return <Labour_list />;
      case "Materials":
        return <ItemTable />;
      case "Attachment":
        return <MaterialsScreen />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.backgroundgrey }]}
      >
        <Safe_area />
        <CompanyBar />
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
        style={[styles.container, { backgroundColor: theme.backgroundgrey }]}
      >
        <Safe_area />
        <CompanyBar />
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
      style={[styles.container, { backgroundColor: theme.backgroundgrey }]}
    >
      <Safe_area />
      <CompanyBar />

      <View
        style={{
          backgroundColor: theme.background,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingBottom: 30,
        }}
      >
        {/* Task Row */}
        <View style={styles.taskRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="chevron-left" size={30} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.taskName, { color: theme.text }]}>
              {task.title || "Task Name"}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {task.createdBy?.fName} {task.createdBy?.lName}
          </Text>
        </View>

        {/* Progress + Members */}
        <View style={styles.progressRow}>
          <CircularProgress percentage={task.progress || 0} />
          <View style={styles.memberRow}>
            {task.assignedToSupervisors
              ?.slice(0, 3)
              .map((supervisor, index) => (
                <View
                  key={`supervisor-${index}`}
                  style={[
                    styles.memberAvatar,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text
                    style={[styles.memberInitial, { color: theme.background }]}
                  >
                    {supervisor.fName?.charAt(0)}
                    {supervisor.lName?.charAt(0)}
                  </Text>
                </View>
              ))}
            {task.assignedToLabourers?.slice(0, 2).map((labourer, index) => (
              <View
                key={`labourer-${index}`}
                style={[
                  styles.memberAvatar,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Text
                  style={[styles.memberInitial, { color: theme.background }]}
                >
                  {labourer.fName?.charAt(0)}
                  {labourer.lName?.charAt(0)}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={[
                styles.addMember,
                {
                  borderColor: theme.secondary,
                  backgroundColor: theme.background,
                },
              ]}
            >
              <Entypo name="plus" size={20} color={theme.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardContainer}>
          <AttendancaceBox
            backgroundColor={theme.boxes03[0]}
            circle_color={theme.boxes03[1]}
            Ionicons_name="people-outline"
            Ionicons_color={theme.boxes03[2]}
            Text1="Labours"
            text2={getAssignedPeopleCount().toString()}
          />
          <AttendancaceBox
            backgroundColor={theme.boxes02[0]}
            circle_color={theme.boxes02[1]}
            Ionicons_name="cash-outline"
            Ionicons_color={theme.boxes02[2]}
            Text1="Expenses"
            text2="0"
          />
          <AttendancaceBox
            backgroundColor={theme.boxes01[0]}
            circle_color={theme.boxes01[1]}
            Ionicons_name="attach"
            Ionicons_color={theme.boxes01[2]}
            Text1="Attachments"
            text2={getAttachmentsCount().toString()}
          />
        </View>
      </View>

      {/* Tabs */}
      <View
        style={[
          styles.tabRow,
          {
            backgroundColor: theme.background,
            borderColor: theme.listItemBorder,
          },
        ]}
      >
        {["Images", "Labours", "Materials", "Attachment"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActive(item)}
            style={styles.menuItem}
          >
            <Text
              style={[
                styles.text,
                { color: theme.text },
                active === item && {
                  backgroundColor: theme.primary,
                  color: theme.background,
                  textDecorationLine: "underline",
                  textDecorationColor: theme.background,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>{renderPageContent()}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  taskName: { fontSize: 18, fontWeight: "600", marginLeft: 5 },
  userName: { fontSize: 16, fontWeight: "600" },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 12,
    alignItems: "center",
  },
  memberRow: { flexDirection: "row", alignItems: "center" },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -10,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  memberInitial: {
    fontSize: 14,
    fontWeight: "600",
  },
  memberImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -10,
    borderWidth: 2,
  },
  addMember: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
  },
  menuItem: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  text: {
    fontSize: 15,
  },
});
