import React, { useRef, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Back_Text_Butt from "@/components/ui/backBtn";
import { useTheme } from "@/context/ThemeContext";

export default function DropImageExample({ onDropChange }: any) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [dropped, setDropped] = useState(false);
  const { theme } = useTheme();

  const toggleDrop = async () => {
  const newValue = !dropped;   // ✅ calculate new value
  setDropped(newValue);        // ✅ update local state

  if (onDropChange) {
    await onDropChange(newValue);   // ✅ await if async
  }

  // animations
  Animated.timing(heightAnim, {
    toValue: newValue ? 200 : 0,
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
        <Back_Text_Butt path="/tabs/Sites/Site" text="Site Name" />
        <TouchableOpacity onPress={toggleDrop} style={styles.button}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <AntDesign name="down" size={28} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ height: heightAnim, overflow: "hidden", padding: 10 }}>
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
