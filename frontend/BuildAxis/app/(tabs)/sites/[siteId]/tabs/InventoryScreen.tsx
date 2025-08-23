import React from "react";
import { StyleSheet, View } from "react-native";
import { Overview } from "../../../../../components/ui/summaryBoxes";
import { useTheme } from "../../../../../context/ThemeContext"; // ✅ import theme
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export const Inventory = ({ item }: any) => {
  const { theme } = useTheme(); // ✅ get active theme

  return (
    <View style={[styles.grid, { backgroundColor: theme.background }]}>
      <Overview
          variant="boxes01"
          Ionicons_name="people"
          Text1="Main Inventory"
          text2="50"
         
          icon={<MaterialCommunityIcons name="warehouse" size={40}  color={theme.boxes01[2]} />}
        />

        <Overview
          variant="boxes02"
          Ionicons_name="cash-outline"
          Text1="Site Inventory"
          text2="10"
          icon={<FontAwesome5 name="boxes" size={40}  color={theme.boxes02[2]} />}

        />
        <Overview
          variant="boxes03"
          Ionicons_name="cube-outline"
          Text1="Damage"
          text2="13"
 
          icon={<MaterialCommunityIcons name="alert-octagon" size={40}   color={theme.boxes03[2]} />}

        />
        <Overview
          variant="boxes04"
          Ionicons_name="construct-outline"
          Text1="Repair Items"
          text2="14"
       
          icon={<Ionicons name="construct"  size={40}  color={theme.boxes04[2]} />}

        />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 15,
  },
});
