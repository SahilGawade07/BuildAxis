import React, { useRef, useState } from "react";
import {
  StatusBar,
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import TopTabs from "@/components/Sites/tasks";

function SmoothCollapsibleHeader() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const dropAnim = useRef(new Animated.Value(1)).current; // 1 = expanded, 0 = collapsed
  const [expanded, setExpanded] = useState(true);

  const toggle = () => {
    Animated.timing(dropAnim, {
      toValue: expanded ? 0 : 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => setExpanded(!expanded));
  };

  // 🔹 Base header height (without image)
  const baseHeaderHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [200, 70], // shrink on scroll
    extrapolate: "clamp",
  });

  // 🔹 Image container height depends on dropdown + scroll
  const imageHeight = Animated.multiply(
    dropAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100], // only show when expanded
    }),
    scrollY.interpolate({
      inputRange: [0, 150],
      outputRange: [1, 0], // hide when scrolling
      extrapolate: "clamp",
    })
  );

  // 🔹 Image opacity for smooth fade-out on scroll
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* 🔽 Smooth Collapsible Header */}
      <Animated.View style={[styles.header, { height: baseHeaderHeight }]}>
        <View style={styles.topRow}>
          <Text style={styles.title}>🏗 Site Name</Text>
          <TouchableOpacity onPress={toggle}>
            <AntDesign
              name={expanded ? "up" : "down"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* Dropdown Image - hides when scroll */}
        <Animated.View style={{ height: imageHeight, opacity: imageOpacity }}>
          <Image
            source={require("@/assets/images/Construction.png")}
            style={styles.image}
          />
        </Animated.View>
      </Animated.View>

      {/* 🔽 Tab content */}
      <Animated.View style={{ flex: 1 }}>
        <TopTabs
          handleScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    elevation: 4,
    zIndex: 10,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 10,
  },
});

export default SmoothCollapsibleHeader;
