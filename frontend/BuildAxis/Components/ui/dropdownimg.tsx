import React, { useRef, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Back_Text_Butt from "@/components/ui/backBtn";
import { useTheme } from "@/context/ThemeContext";

export default function DropImageExample() {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current; // for button rotation
  const [dropped, setDropped] = useState(false);
  const { theme } = useTheme();

  const toggleDrop = () => {
    if (!dropped) {
      setDropped(true);
      // Animate image drop
      Animated.timing(heightAnim, {
        toValue: 200,
        duration: 250,
        useNativeDriver: false,
      }).start();
      // Animate button rotation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      setDropped(false);
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  // Interpolate rotation from 0 -> 180 degrees
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.primary,
          paddingBottom: dropped ? 20 : 0,
        },
      ]}
    >
      {/* Fixed row */}
      <View style={styles.row}>
        <Back_Text_Butt path="/tabs/Sites/Site" text="Site Name" />
        <TouchableOpacity onPress={toggleDrop} style={styles.button}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <AntDesign name="down" size={28} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Image directly below */}
      <Animated.View style={{ height: heightAnim, overflow: "hidden", padding: 10 }}>
        {dropped && (
          <Image
            source={require("@/assets/images/Construction.png")}
            style={styles.image}
          />
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
    height: 190,
    resizeMode: "cover",
    
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent:"center",
    
  },
  button: {
    paddingRight: 15,
  },
});
