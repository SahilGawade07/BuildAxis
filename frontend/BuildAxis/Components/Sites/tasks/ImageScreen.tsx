import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext"; // ✅ import theme context

// 🔹 Types
type TaskImage = { url: string };
type Task = { images: TaskImage[]; description: string; date: string; time: string };

// 🔹 Dummy fetch
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
  const { theme } = useTheme();

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

  // 🔹 Render horizontal image slider for each task
  const renderImages = ({ item }: { item: TaskImage }) => (
    <View style={[styles.bannerCard, { backgroundColor: theme.backgroundgrey }]}>
      <Image source={{ uri: item.url }} style={styles.bannerImage} />
    </View>
  );

  // 🔹 Render each task card
  const renderTask = ({ item }: { item: Task }) => (
    <View
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
          {item.date} • {item.time}
        </Text>
      </View>

      {/* Horizontal Image Carousel */}
      <FlatList
        data={item.images}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageRow}
      />

      {/* Description */}
      <View style={styles.infoContainer}>
        <Text style={[styles.description, { color: theme.text }]}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={renderTask}
      contentContainerStyle={[styles.page, { backgroundColor: theme.background }]}
    />
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  page: {
    padding: 12,
    paddingBottom: 40,
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
    width: width * 0.85,
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
