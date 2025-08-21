import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Expencess } from "@/components/ui/expencesseBox";
import { useTheme } from "../../../../../context/ThemeContext"; 
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Addbuttons } from "@/components/ui/addbutton";
import { useRouter } from "expo-router";
import { Addbuttonspage } from "@/components/ui/addbuttonforpage";

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
  const { theme } = useTheme(); 
  const router = useRouter(); 

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={projects}
        renderItem={({ item }) => <Expencess item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10 }}
      />
       <Addbuttonspage
                iconname={
                    <FontAwesome6 name="add" size={20} color="white" />
                }
            />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});