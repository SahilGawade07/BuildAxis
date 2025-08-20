import { useRef, useState } from "react";
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export function useScrollHeader() {
  const [lastOffset, setLastOffset] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;

    if (currentOffset > lastOffset && currentOffset > 50) {
      // scrolling down → hide
      if (showHeader) {
        setShowHeader(false);
        Animated.timing(translateY, {
          toValue: -390, // move header up
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    } else if (currentOffset < lastOffset) {
      // scrolling up → show
      if (!showHeader) {
        setShowHeader(true);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
    setLastOffset(currentOffset);
  };

  return { handleScroll, translateY, showHeader };
}
