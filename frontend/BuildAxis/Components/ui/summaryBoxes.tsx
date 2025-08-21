import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

import { ReactNode } from "react";

interface OverviewProps {
  variant: "boxes01" | "boxes02" | "boxes03" | "boxes04"; // choose color set
  Ionicons_name: React.ComponentProps<typeof Ionicons>["name"]; // icon name
  Text1: string;
  text2?: string;
  text3?: string;
  icon?: ReactNode; // ✅ allow passing custom icon component
}

export function Overview({
  variant,
  Ionicons_name,
  Text1,
  text2,
  text3,
  icon
}: OverviewProps) {
  const { theme } = useTheme();

  // pick colors from the variant (boxes01, boxes02…)
  const [cardBg, circleBg, iconColor] = theme[variant];

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      {/* Circle with Icon */}
      <View style={[styles.circle, { backgroundColor: circleBg }]}>
        {/* <Ionicons name={Ionicons_name} size={60} color={iconColor} /> */}
        {icon} 
      </View>

      {/* Texts */}
      <Text style={[styles.cardTitle, { color: theme.text }]}>{Text1}</Text>
      {text2 ? (
        <Text style={[styles.cardText, { color: theme.text }]}>{text2}</Text>
      ) : null}
      {text3 ? (
        <Text style={[styles.cardText, { color: theme.text }]}>{text3}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    height: 200,
    padding: 15,
    marginBottom: 25,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 8,
    textAlign: "center",
  },
  cardText: {
    fontSize: 14,
    textAlign: "center",
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
