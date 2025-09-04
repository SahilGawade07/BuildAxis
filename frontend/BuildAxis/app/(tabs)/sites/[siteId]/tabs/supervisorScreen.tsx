import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import AttendancaceBox from "@/components/ui/attandanceBox";
import Submit_bbutt from "../../../../../components/ui/SubmitBtn";
import LabourList from "../../../../../components/ui/labourList";
import { BlurView } from "expo-blur";
import AttendanceModal from "@/components/Sites/popupScreens/attandancePopup";
import { useTheme } from "../../../../../context/ThemeContext";
import { FloatingButtons } from "@/components/ui/floatingbutton";
import { FontAwesome6 } from "@expo/vector-icons";
import { Addbuttonspage } from "@/components/ui/addbuttonforpage";
import PeopleList from "@/app/labourui";
import { useLocalSearchParams } from "expo-router";

const data = [
  { id: "1", name: "John Supervisor" },
  { id: "2", name: "Jane Manager" },
  { id: "3", name: "Mike Lead" },
  { id: "4", name: "Sarah Coordinator" },
];

export default function Supervisor_list() {
  const [active, setActive] = useState("Present");
  const [popup, setpopup] = useState(false);
  const params = useLocalSearchParams();
  const siteId = Array.isArray(params.siteId)
    ? params.siteId[0]
    : params.siteId;

  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <PeopleList siteId={siteId} type={"supervisor"} />
      <Addbuttonspage
        iconname={<FontAwesome6 name="add" size={20} color="white" />}
        path={`/(tabs)/sites/${siteId}/tabs/addSupervisorToSite`}
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
