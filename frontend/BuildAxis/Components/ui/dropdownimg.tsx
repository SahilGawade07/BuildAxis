import React from "react";
import { View, StyleSheet } from "react-native";
import Back_Text_Butt from "@/components/ui/backBtn";
import { useTheme } from "@/context/ThemeContext";

export default function DropImageExample({ title = "Site Name" }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View style={styles.row}>
        <Back_Text_Butt text={title} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
