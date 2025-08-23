import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function DateSelector() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const { theme } = useTheme();

  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Animate rotation when showPicker changes
  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: showPicker ? 1 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [showPicker]);

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Format: "31 Jul 2025"
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"], // rotate arrow down when open
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dateButton, { borderColor: theme.text }]}
        onPress={() => setShowPicker((prev) => !prev)}
      >
        <Ionicons name="calendar-outline" size={18} color={theme.icons} />
        <Text style={[styles.dateText, { color: theme.text }]}>
          {formatDate(date)}
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={18} color={theme.icons} />
        </Animated.View>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   
    marginBottom: 4,
  },
  dateButton: {
    flexDirection: "row",

  
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
    
  },
});
