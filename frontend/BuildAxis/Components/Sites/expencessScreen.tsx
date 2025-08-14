import React from "react";
import { View, FlatList } from "react-native";
import { Expencess } from "@/Components/Common/expencesseBox";
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
    status: "AcPaidtive",
  },
];

export const ExpencessScreen = () => {
  return (
    <View>
      <FlatList
        data={projects}
        renderItem={Expencess}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </View>
  );
};
