import React from "react";
import {  StyleSheet, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Safe_area } from "@/components/ui/safeArea";
import DropImageExample from "@/components/ui/dropdownimg";
import Main_Sites from "@/app/(tabs)/sites/[siteId]/tabs/index"; 
import { SafeAreaView } from "react-native-safe-area-context";

export default function Main_Site() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      

      {/* Optional top header / image */}
      
        <DropImageExample />
      

      {/* Swipeable tabs */}
      <Main_Sites />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:40,
  },
});
