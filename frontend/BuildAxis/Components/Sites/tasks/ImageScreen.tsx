import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from "react-native";

type TaskImage = { url: string };

// Mock API call
const getTaskImages = async (): Promise<TaskImage[]> => {
  return [
    { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e" },
    { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427" },
    { url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d" },
  ];
};

export default function ImageBanner() {
  const [taskImages, setTaskImages] = useState<TaskImage[]>([]);
  const [date, setDate] = useState<string>("2025-08-13");
  const [time, setTime] = useState<string>("12:26 PM");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getTaskImages();
        setTaskImages(data);
      } catch (error) {
        console.error("Error fetching task images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <View style={styles.container}>


      {/* Horizontal Image Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop:20}}
      >
        {taskImages.map((item, index) => (
          <View key={index} style={styles.bannerCard}>
            <Image source={{ uri: item.url }} style={styles.bannerImage} />
          </View>
        ))}
      </ScrollView>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        <Text style={styles.description}>
          If you want the text itself to be blurred, you’d need a completely
          different approach using Skia or by rendering it as an image first.
        </Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>{date}</Text>
          <Text style={styles.dateTime}>{time}</Text>
        </View>
        <View style={{borderWidth:1}}></View>
      </View>

      {/* Horizontal Image Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {taskImages.map((item, index) => (
          <View key={index} style={styles.bannerCard}>
            <Image source={{ uri: item.url }} style={styles.bannerImage} />
          </View>
        ))}
      </ScrollView>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        <Text style={styles.description}>
          If you want the text itself to be blurred, you’d need a completely
          different approach using Skia or by rendering it as an image first.
        </Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>{date}</Text>
          <Text style={styles.dateTime}>{time}</Text>
        </View>
      </View>
      {/* Horizontal Image Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {taskImages.map((item, index) => (
          <View key={index} style={styles.bannerCard}>
            <Image source={{ uri: item.url }} style={styles.bannerImage} />
          </View>
        ))}
      </ScrollView>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        <Text style={styles.description}>
          If you want the text itself to be blurred, you’d need a completely
          different approach using Skia or by rendering it as an image first.
        </Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>{date}</Text>
          <Text style={styles.dateTime}>{time}</Text>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 12,
    paddingBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    margin: 14,
    color: "#333",
  },
  bannerCard: {
    width: width * 0.8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    marginRight: 14,
    elevation: 3,
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,

    padding: 8,
    borderRadius: 8,
  },
  dateTime: {
    fontSize: 13,
    color: "#444",
    fontWeight: "600",
  },
});
