import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

export default function CircularProgress({ percentage = 40 }) {
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={140} height={140}>
        {/* Background circle */}
        <Circle
          stroke="#f4f0ff"
          fill="none"
          cx="70"
          cy="70"
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          stroke="#0057ff"
          fill="none"
          cx="70"
          cy="70"
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          rotation="-90"
          origin="70,70"
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={styles.completedText}>Completed</Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
  },
  completedText: {
    fontSize: 14,
    color: "#777",
  },
  percentageText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
});
