import ProjectList from "@/app/raw";
import { Addbuttonspage } from "@/components/ui/addbuttonforpage";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";

export const Assigntask = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProjectList />

      <Addbuttonspage
        iconname={<FontAwesome6 name="add" size={20} color="white" />}
        path={"/addtask"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
