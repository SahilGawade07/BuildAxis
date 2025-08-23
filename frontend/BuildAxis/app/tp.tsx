import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import GestureRecognizer from "react-native-swipe-gestures";
import TopTabs from "@/components/Sites/tasks";
import AttendancaceBox from "@/components/ui/attandanceBox";
import CircularProgress from "@/components/Sites/tasks/common/circleprgressbar";
import HeaderBar from "@/components/ui/headerBar";

const HEADER_MAX_HEIGHT = 350;
const HEADER_MIN_HEIGHT = 0;

export default function TaskDetailsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;
  const [dropped, setdropped] = useState(false);

  const members = [
    { id: 1, img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 3, img: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 4, img: "https://randomuser.me/api/portraits/women/45.jpg" },
  ];

  const scrollY = useRef(new Animated.Value(0)).current;

  // 🔹 Derived header animations
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

  // 🔹 Smooth Swipe handling
// 🔹 Derived content translation (instead of paddingTop jump)
const contentTranslateY = scrollY.interpolate({
  inputRange: [0, 100],
  outputRange: [HEADER_MAX_HEIGHT, 0], // header height to compacted height
  extrapolate: "clamp",
});

// 🔹 Smooth Swipe handling
const handleSwipeUp = () => {
  setdropped(true);
  Animated.spring(scrollY, {
    toValue: 100, // collapse
    useNativeDriver: false,
    speed: 6,
    bounciness: 4,
  }).start();
};

const handleSwipeDown = () => {
  setdropped(false);
  Animated.spring(scrollY, {
    toValue: 0, // expand
    useNativeDriver: false,
    speed: 6,
    bounciness: 4,
  }).start();
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundgrey }]}>
      <StatusBar
        backgroundColor={theme.primary}
        barStyle={theme.isDark ? "light-content" : "lght-content"}
      />
      <HeaderBar title="Task Name" />


<View style={{backgroundColor:"#fff",marginBottom:10,borderBottomRightRadius:20,borderBottomLeftRadius:20}}>
      
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
</View>
                  <TopTabs />
                 

     
    </SafeAreaView>
  );
}

  const styles = StyleSheet.create({
  container: { 
    flex: 1,
        backgroundColor:"#fff"
 
  },

  // 🔹 Progress + Members Row
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor:"#fff"
  },

  memberRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },

  memberImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: -12,
    borderWidth: 2,
  },

  addMember: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  // 🔹 Cards Row
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor:"#fff"
  },

  // 🔹 Header row (if you add custom title/subtitle later)
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  taskName: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginLeft: 5 
  },

  userName: { 
    fontSize: 16, 
    fontWeight: "500" 
  },

  // 🔹 Header background (animated area if used later)
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
});


