// ✅ summaryBoxes.tsx (Overview)
import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";



interface OverviewProps {
  variant: "boxes01" | "boxes02" | "boxes03" | "boxes04"; // choose color set
  Text1: string;
  text2?: string;
  text3?: string;
  icon?: ReactNode; // ✅ allow passing custom icon component
}

export function Overview({
  variant,

  Text1,
  text2,
  text3,
  icon
}: OverviewProps) {
  const { theme } = useTheme();
  const [cardBg, circleBg, iconColor] = theme[variant];

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      {/* Circle with Icon */}
      <View style={[styles.circle, { backgroundColor: circleBg }]}>
        {/* <Ionicons name={Ionicons_name} size={60} color={iconColor} /> */}
        {icon} 
      </View>

      {/* Text Content */}
      <Text style={[styles.cardTitle, { color: theme.textforboxex }]}>{Text1}</Text>
      {text2 && (
        <Text style={[styles.cardSubtitle, { color: theme.textforboxex }]}>{text2}</Text>
      )}
      {text3 && (
        <Text style={[styles.cardSubtitle, { color: theme.textforboxex }]}>{text3}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "48%",
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",

    // Modern shadows
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    
    marginBottom: 2,
  },
});
