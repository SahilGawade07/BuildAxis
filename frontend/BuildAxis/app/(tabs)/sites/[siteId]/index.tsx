import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import DropImageExample from "@/components/ui/dropdownimg";
import Main_Sites from "@/app/(tabs)/sites/[siteId]/tabs/index";
import HeaderBar from "@/components/ui/headerBar";

export default function Main_Site() {
  const { theme } = useTheme();
  const { siteId, siteName } = useLocalSearchParams();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      
      <HeaderBar title={(siteName as string) || "Site Details"} />
      {/* Main Tabs */}
      <Main_Sites />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
