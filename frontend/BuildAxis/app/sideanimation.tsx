import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import DropImageExample from "@/components/ui/dropdownimg";
import Main_Sites from "@/app/(tabs)/sites/[siteId]/tabs/index";

export default function Main_Site() {
  const { theme } = useTheme();
  const [dropped, setDropped] = React.useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Drop header */}
      <DropImageExample onDropChange={(value: boolean) => setDropped(value)} />
      {/* Main Tabs */}
      <Main_Sites dropped={dropped} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
