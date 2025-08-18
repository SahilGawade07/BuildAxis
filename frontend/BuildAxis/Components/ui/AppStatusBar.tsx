import React from "react";
import { StatusBar, StatusBarStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface AppStatusBarProps {
  backgroundColor?: string;
  barStyle?: StatusBarStyle;
  translucent?: boolean;
}

export default function AppStatusBar({
  backgroundColor,
  barStyle,
  translucent = false,
}: AppStatusBarProps) {
  const { theme } = useTheme();

  return (
    <StatusBar
      backgroundColor={backgroundColor || theme.background}
      barStyle={barStyle || (theme.isDark ? "light-content" : "dark-content")}
      translucent={translucent}
    />
  );
}
