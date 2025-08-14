import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, DarkColors } from "../Thems/color";

// 1. Type for theme palette
export type ThemeColors = typeof Colors;

// 2. Type for theme mode
export type ThemeMode = "light" | "dark" | "system";

// 3. Type for context value
interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  changeTheme: (mode: ThemeMode) => void;
}

// 4. Create context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: Colors,
  themeMode: "system",
  changeTheme: () => {},
});

// 5. Props for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// 6. ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light' or 'dark'
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  // Load saved theme preference
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("themeMode");
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeMode(saved);
      }
    })();
  }, []);

  // Save theme preference
  const changeTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    AsyncStorage.setItem("themeMode", mode);
  };

  // Decide which theme to use
  const theme =
    themeMode === "light"
      ? Colors
      : themeMode === "dark"
      ? DarkColors
      : systemScheme === "dark"
      ? DarkColors
      : Colors;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
