import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { Addbuttonspage } from "@/components/ui/addbuttonforpage";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "../../../../../context/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import { getAllTasksRequest } from "@/lib/api";
import TaskList from "./TaskList";
import { Task } from "@/types/task";

export const Assigntask = () => {
  const { theme } = useTheme();
  const { siteId, siteName } = useLocalSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [siteId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getAllTasksRequest({
        siteId: siteId as string,
        page: 1,
        limit: 50,
      });

      if (response.success && response.data?.tasks) {
        setTasks(response.data.tasks);
      } else {
        setError(response.message || "Failed to fetch tasks");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading tasks...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TaskList tasks={tasks} onRefresh={fetchTasks} />

      <Addbuttonspage
        iconname={<FontAwesome6 name="add" size={20} color="white" />}
        path={`/sites/${siteId}/createTask`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
});
