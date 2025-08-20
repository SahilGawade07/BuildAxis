import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export const ContinueBtn = ({ text, touchable, onPresss }: any) => {
  return (
    <TouchableOpacity
      style={[
        styles.continue,
        touchable
          ? { backgroundColor: "#007AFF" } // Blue when enabled
          : { backgroundColor: "#f9f9f9" }, // Light grey when disabled
      ]}
      disabled={!touchable} // 👈 Also: actually disable the button when not touchable
      onPress={() => {
        if (touchable) onPresss();
      }}
    >
      <Text
        style={[
          styles.forwordbutt,
          touchable ? { color: "#ffffff" } : { color: "#999" },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  continue: {
    backgroundColor: "#e0e0e0",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginVertical: 10,
  },
  forwordbutt: {
    color: "#999",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ContinueBtn;
