import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext"; 

interface HeaderBarProps {
  title: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title }) => {
  const router = useRouter();
  const { theme } = useTheme(); // get theme

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={"#ffffff"} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.title, { color: "#ffffff" }]}>{title}</Text>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    elevation: 2, // small shadow for Android
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "600"
  },
});
