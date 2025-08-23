import React, { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

type CardItem = {
  id: string;
  title: string;
  subtitle: string[];
  color: string;
  icon: JSX.Element;
};

const cards: CardItem[] = [
  {
    id: "1",
    title: "Attendance",
    subtitle: ["Supervisor: 20", "Labours: 100"],
    color: "#E3F2FD",
    icon: <Ionicons name="people" size={40} color="#1976D2" />,
  },
  {
    id: "2",
    title: "Daily Expenses",
    subtitle: ["10000 Rs"],
    color: "#E8F5E9",
    icon: <Ionicons name="trending-up" size={34}  color="#2E7D32" />,
  },
  {
    id: "3",
    title: "Inventory",
    subtitle: ["Crush sand is required.", "Bricks are required."],
    color: "#FFF8E1",
    icon: <MaterialIcons name="inventory" size={40} color="#F9A825" />,
  },
  {
    id: "4",
    title: "Sites",
    subtitle: ["Active: 7", "Inactive: 4"],
    color: "#FFEBEE",
    icon: <MaterialIcons name="construction" size={40} color="#C62828" />,
  },
];

export default function Dashboard() {
  const renderItem = ({ item }: { item: CardItem }) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale }], flex: 1 }}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: item.color }]}
          activeOpacity={0.8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <View style={styles.iconContainer}>{item.icon}</View>
          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle.map((line, idx) => (
            <Text key={idx} style={styles.subtitle}>
              {line}
            </Text>
          ))}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 40,
    padding: 14,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
});
