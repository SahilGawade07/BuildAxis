import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext"; // ✅ import theme context

type TaskImage = { url: string };
type Task = { images: TaskImage[]; description: string; date: string; time: string };

const getTasks = async (): Promise<Task[]> => {
  return [
    {
      images: [
        { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e" },
        { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427" },
        { url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d" },
      ],
      description:
        "If you want the text itself to be blurred, you’d need a completely different approach using Skia or by rendering it as an image first.",
      date: "2025-08-13",
      time: "12:26 PM",
    },
    {
      images: [
        { url: "https://images.unsplash.com/photo-1517816428104-797678c7cf14" },
        { url: "https://images.unsplash.com/photo-1532910404447-129d4b0dcd3b" },
      ],
      description:
        "This is another task description with some extra info about it.",
      date: "2025-08-14",
      time: "10:45 AM",
    },
    {
      images: [
        { url: "https://images.unsplash.com/photo-1473187983305-f615310e7daa" },
      ],
      description:
        "Final task example. Images are fewer here, but still shown in a scrollable row.",
      date: "2025-08-15",
      time: "4:10 PM",
    },
  ];
};

export default function ImageBanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { theme } = useTheme(); // ✅ access theme

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: theme.background }]} // ✅ dynamic background
      showsVerticalScrollIndicator={false}
    >
      {tasks.map((task, idx) => (
        <View
          key={idx}
          style={[
            styles.taskCard,
            { backgroundColor: theme.listItemFill, borderColor: theme.listItemBorder },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image
                source={require("@/assets/images/logo.jpg")}
                style={styles.profileImage}
              />
              <Text style={[styles.username, { color: theme.text }]}>
                Shraddha Swant
              </Text>
            </View>
            <Text style={[styles.dateText, { color: theme.icons }]}>
              {task.date}
            </Text>
          </View>

          {/* Horizontal Image Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageRow}
          >
            {task.images.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.bannerCard,
                  { backgroundColor: theme.backgroundgrey },
                ]}
              >
                <Image source={{ uri: item.url }} style={styles.bannerImage} />
              </View>
            ))}
          </ScrollView>

          {/* Description */}
          <View style={styles.infoContainer}>
            <Text style={[styles.description, { color: theme.text }]}>
              {task.description}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 12,
  },
  taskCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 14,
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
  },
  imageRow: {
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  bannerCard: {
    width: width * 0.8,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 14,
    elevation: 2,
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
