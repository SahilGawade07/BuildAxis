import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TextInput } from "react-native";

type TaskImage = {
  url: string;
};

// Example mock fetch function (replace with your API call)
const getTaskImages = async (): Promise<TaskImage[]> => {
  return [
    {
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    },
    {
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    },
    {
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    },
  ];
};

export default function ImageBanner() {
  const [taskImages, setTaskImages] = useState<TaskImage[]>([]);
  const [description, setDescription] = useState<string>("");
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
      <Text style={styles.sectionTitle}>Task Images</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {taskImages.map((item, index) => (
          <View key={index} style={styles.bannerCard}>
            <Image
              source={{ uri: item.url }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.infoContainer}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>{date}</Text>
          <Text style={styles.dateTime}>{time}</Text>
        </View>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6FB" },
  sectionTitle: { fontSize: 16, fontWeight: "600", margin: 12 },
  descriptionInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: -10,
    marginTop: 8,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 60,
  },
  bannerCard: {
    width: 250,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerImage: {
    width: "100%",
    height: 150,
  },
  infoContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: "#F4F6FB",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
  },
  dateTime: {
    fontSize: 12,
    color: "#888",
  },
});