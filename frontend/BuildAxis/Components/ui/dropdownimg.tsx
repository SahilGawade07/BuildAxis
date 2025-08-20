import React, { useRef, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Back_Text_Butt from "@/components/ui/backBtn";

export default function DropImageExample() {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [dropped, setDropped] = useState(false);

  const toggleDrop = () => {
    if (!dropped) {
      setDropped(true);
      Animated.timing(heightAnim, {
        toValue: 180, // 👈 image height
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setDropped(false));
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed row */}
      <View style={styles.row}>
        <Back_Text_Butt path="/tabs/Sites/Site" text="Site Name" />
        <TouchableOpacity onPress={toggleDrop} style={styles.button}>
          <AntDesign name={dropped ? "up" : "down"} size={28} color="black" />
         
        </TouchableOpacity>
      </View>

      {/* Image directly below */}
      <Animated.View style={{ height: heightAnim, overflow: "hidden",padding:10 }}>
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
  container: { padding: 0 },
  image: {    padding:15, width: 370, height: 180, resizeMode: "cover" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent:"center"
  },
  button: {
    paddingRight:15

  },
});
