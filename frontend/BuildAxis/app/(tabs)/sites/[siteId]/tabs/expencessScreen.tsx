import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Expencess } from "@/components/ui/expencesseBox";
import { useTheme } from "../../../../../context/ThemeContext"; 

const projects = [
  {
    id: "1",
    name: "Bill Name",
    progress: "Paid By",
    date: "12/02/2022",
    status: "Paid",
  },
  {
    id: "2",
    name: "Bill Name",
    progress: "Paid By",
    date: "15/04/2023",
    status: "Paid",
  },
  {
    id: "3",
    name: "Sky Towers",
    progress: "Paid By",
    date: "01/10/2024",
    status: "Paid",
  },
  {
    id: "4",
    name: "Blue Ocean",
    progress: "Paid By",
    date: "20/08/2025",
    status: "Active",
  },
];

export const ExpencessScreen = () => {
  const { theme } = useTheme(); // ✅ get theme

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={projects}
        renderItem={({ item }) => <Expencess item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
