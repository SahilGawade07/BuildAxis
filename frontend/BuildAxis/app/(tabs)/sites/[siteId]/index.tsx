import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Safe_area } from "@/components/ui/safeArea";
import DropImageExample from "@/components/ui/dropdownimg";
import Main_Sites from "@/app/(tabs)/sites/[siteId]/tabs/index"; // import the tab view component
import { SafeAreaView } from "react-native-safe-area-context";

export default function Main_Site() {
  const { theme } = useTheme();
  const [dropped, setDropped] = React.useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Drop header, notify parent when toggled */}
<DropImageExample onDropChange={(value: boolean) => setDropped(value)} />


      {/* Now Main_Sites receives dropped */}
      <Main_Sites dropped={dropped} />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:40,
  },
});
