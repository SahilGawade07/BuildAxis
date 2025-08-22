import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ✅ Custom hook
function useSafeScreenSize() {
  const layout = useWindowDimensions(); // full screen size
  const insets = useSafeAreaInsets();   // safe area padding

  const safeWidth = layout.width - insets.left - insets.right;
  const safeHeight = layout.height - insets.top - insets.bottom;

  return { layout, insets, safeWidth, safeHeight };
}

export default function MyScreen() {
  const { layout, insets, safeHeight } = useSafeScreenSize();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     <Text>layout.height= {layout.height }</Text>
      <Text>insets.top = {insets.top}</Text>
      <Text>a = {layout.height - 68 - insets.top-insets.bottom}</Text>
      <Text>b = {layout.height - (layout.height - 68 - insets.top-insets.bottom)}</Text>
      <Text>Insets Bottom: {insets.bottom}</Text>
      <Text>Safe Height: {safeHeight}</Text>
    </View>
  );
}
