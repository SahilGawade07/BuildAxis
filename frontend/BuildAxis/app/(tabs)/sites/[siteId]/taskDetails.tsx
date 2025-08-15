import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Safe_area } from "@/components/ui/safeArea";
import { CompanyBar } from "@/components/ui/orgNameBar";
import AttendancaceBox from "@/components/ui/attandanceBox";
import { Colors } from "@/Thems/color"; // ✅ Updated import
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import MaterialsScreen from "@/components/Sites/tasks/attachmentScreen";
import ImageScreen from "@/components/Sites/tasks/ImageScreen";
import CircularProgress from "@/components/Sites/tasks/common/circleprgressbar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskDetailsScreen() {
  const members = [
    { id: 1, img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 3, img: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 4, img: "https://randomuser.me/api/portraits/women/45.jpg" },
  ];

  const [active, setActive] = useState("Images");
  const [page, setPage] = useState("Assign Task");

  useEffect(() => {
    setPage(active);
  }, [active]);

  const renderPageContent = () => {
    switch (page) {
      case "Images":
        return <ImageScreen />;
      case "Labours":
        return <Labour_list />;
      case "Materials":
        return <ItemTable />;
      case "Attachment":
        return <MaterialsScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Safe_area />
      <CompanyBar />

      <View
        style={{
          backgroundColor: Colors.background,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingBottom: 30,
        }}
      >
        {/* Task Row */}
        <View style={styles.taskRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="chevron-left" size={30} color={Colors.text} />
            <Text style={[styles.taskName, { color: Colors.text }]}>
              Task Name
            </Text>
          </View>
          <Text style={[styles.userName, { color: Colors.text }]}>
            Mr.Chemate
          </Text>
        </View>

        {/* Progress + Members */}
        <View style={styles.progressRow}>
          <CircularProgress />
          <View style={styles.memberRow}>
            {members.map((m) => (
              <Image
                key={m.id}
                source={{ uri: m.img }}
                style={styles.memberImg}
              />
            ))}
            <TouchableOpacity style={styles.addMember}>
              <Entypo name="plus" size={20} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardContainer}>
          <AttendancaceBox
            backgroundColor={Colors.boxes03[0]}
            circle_color={Colors.boxes03[1]}
            Ionicons_name="people-outline"
            Ionicons_color={Colors.boxes03[2]}
            Text1="Labours"
            text2="155"
          />
          <AttendancaceBox
            backgroundColor={Colors.boxes02[0]}
            circle_color={Colors.boxes02[1]}
            Ionicons_name="cash-outline"
            Ionicons_color={Colors.boxes02[2]}
            Text1="Expenses"
            text2="100"
          />
          <AttendancaceBox
            backgroundColor={Colors.boxes01[0]}
            circle_color={Colors.boxes01[1]}
            Ionicons_name="attach"
            Ionicons_color={Colors.boxes01[2]}
            Text1="Attachments"
            text2="155"
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["Images", "Labours", "Materials", "Attachment"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActive(item)}
            style={styles.menuItem}
          >
            <Text style={[styles.text, active === item && styles.activeText1]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>{renderPageContent()}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundgrey },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  taskName: { fontSize: 18, fontWeight: "600", marginLeft: 5 },
  userName: { fontSize: 16, fontWeight: "600" },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 12,
    alignItems: "center",
  },
  memberRow: { flexDirection: "row", alignItems: "center" },
  memberImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -10,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  addMember: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    marginLeft: 15,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: Colors.background,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 15,
  },
  menuItem: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  text: {
    fontSize: 15,
    color: Colors.text,
  },
  activeText1: {
    color: Colors.background,
    textDecorationLine: "underline",
    textDecorationColor: Colors.background,
    fontWeight: "500",
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 10,
  },
});
