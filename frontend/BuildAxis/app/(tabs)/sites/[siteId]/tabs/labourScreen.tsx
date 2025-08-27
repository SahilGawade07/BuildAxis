
import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { useTheme } from "../../../../../context/ThemeContext";
import { FontAwesome6 } from "@expo/vector-icons";
import { Addbuttonspage } from "@/components/ui/addbuttonforpage";
import PeopleList from "@/app/labourui"
import { useLocalSearchParams } from "expo-router";


export default function Labour_list() {

  const { siteId, siteName } = useLocalSearchParams();
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <PeopleList siteId={siteId as string} type={"labour"} />


      <Addbuttonspage
        iconname={<FontAwesome6 name="add" size={20} color="white" />}
        path={`/(tabs)/sites/${siteId}/tabs/addlabourToSite`}
// 👈 trigger after adding
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  text: {
    fontSize: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
