import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Entypo, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { Addbuttons } from "@/components/ui/addbutton"

import { CompanyBar } from "@/components/ui/orgNameBar";
import AttendancaceBox from "@/components/ui/attandanceBox";
import TopTabs from "@/components/Sites/tasks/index";
import CircularProgress from "@/components/Sites/tasks/common/circleprgressbar";

const HEADER_MAX_HEIGHT = 400;
const HEADER_MIN_HEIGHT = 0;

export default function TaskDetailsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;

  const members = [
    { id: 1, img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 3, img: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 4, img: "https://randomuser.me/api/portraits/women/45.jpg" },
  ];

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const headerContentTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundgrey }]}>
      <StatusBar
        backgroundColor={theme.primary}
        barStyle={theme.isDark ? "light-content" : "dark-content"}
      />
      <CompanyBar />
      <View>
        {/* 🔹 Animated Header */}
        
        <Animated.View
          style={[
            styles.header,
            { height: headerHeight, backgroundColor: theme.background },
          ]}
        >

          <Animated.View
            style={{
              opacity: headerContentOpacity,
              transform: [{ translateY: headerContentTranslateY }],
            }}
          >
            {/* <CompanyBar /> */}

            {/* Task Row */}
            <View style={styles.taskRow}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Entypo name="chevron-left" size={30} color={theme.text} />
                <Text style={[styles.taskName, { color: theme.text }]}>Task Name</Text>
              </View>
              <Text style={[styles.userName, { color: theme.text }]}>Mr.Chemate</Text>
            </View>

            {/* Progress + Members */}
            <View style={styles.progressRow}>
              <CircularProgress />
              <View style={styles.memberRow}>
                {members.map((m) => (
                  <Image
                    key={m.id}
                    source={{ uri: m.img }}
                    style={[styles.memberImg, { borderColor: theme.background }]}
                  />
                ))}
                <TouchableOpacity
                  style={[
                    styles.addMember,
                    { borderColor: theme.secondary, backgroundColor: theme.background },
                  ]}
                >
                  <Entypo name="plus" size={20} color={theme.secondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Cards */}
            <View style={styles.cardContainer}>
              <AttendancaceBox
                backgroundColor={theme.boxes03[0]}
                circle_color={theme.boxes03[1]}
                Ionicons_name="people-outline"
                Ionicons_color={theme.boxes03[2]}
                Text1="Labours"
                text2="155"
              />
              <AttendancaceBox
                backgroundColor={theme.boxes02[0]}
                circle_color={theme.boxes02[1]}
                Ionicons_name="cash-outline"
                Ionicons_color={theme.boxes02[2]}
                Text1="Expenses"
                text2="100"
              />
              <AttendancaceBox
                backgroundColor={theme.boxes01[0]}
                circle_color={theme.boxes01[1]}
                Ionicons_name="attach"
                Ionicons_color={theme.boxes01[2]}
                Text1="Attachments"
                text2="155"
              />
            </View>
          </Animated.View>
        </Animated.View>

        {/* 🔹 Scrollable Content */}
        <Animated.ScrollView
          contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
         <View style={{height:windowHeight}}>
<TopTabs handleScroll={handleScroll} />
</View>
        </Animated.ScrollView>



        {/* <Addbuttons
  iconname={
    <MaterialCommunityIcons 
      name="file-image-plus-outline" 
      size={24} 
      color="#fff" 
    />
  }
/>  */}

      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
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
  },
  addMember: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  fab: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    right: 20,
    bottom: 90,
    alignItems: "center",
    justifyContent: "center",
  },
});
