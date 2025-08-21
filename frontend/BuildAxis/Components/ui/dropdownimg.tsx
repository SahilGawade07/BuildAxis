import React, { useRef, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Animated, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Back_Text_Butt from "@/components/ui/backBtn";
import { useTheme } from "@/context/ThemeContext";

const screenHeight = Dimensions.get("window").height;

export default function DropImageExample({ onDropChange }: any) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [dropped, setDropped] = useState(false);
  const { theme } = useTheme();

  const toggleDrop = async () => {
    const newValue = !dropped;
    setDropped(newValue);

    if (onDropChange) {
      await onDropChange(newValue);
    }

    Animated.timing(heightAnim, {
      toValue: newValue ? screenHeight * 0.25 : 0, // 25% of screen height
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: newValue ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.primary, paddingBottom: dropped ? 20 : 0 }]}>
      <View style={styles.row}>
        <Back_Text_Butt text="Site Name" />
        <TouchableOpacity onPress={toggleDrop} style={styles.button}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <AntDesign name="down" size={28} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ height: heightAnim, overflow: "hidden", paddingHorizontal: 10 }}>
        {dropped && (
          <Image source={require("@/assets/images/Construction.png")} style={styles.image} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
  },
  image: {
    width: "100%",
    height: "100%", // fill Animated height
    resizeMode: "cover",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    paddingRight: 15,
  },
});
