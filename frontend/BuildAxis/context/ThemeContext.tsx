import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Colors = {
  primary: "#00174D",
  secondary: "#0247D3",
  background: "#ffffff",
  listItemFill: "#ffffff",
  backgroundgrey: "#F5F5F5",
  text: "#000000",
  icons: "#999",
  boxes01: ["#DBEDFD", "#B6DEFF", "#4682B4"],
  boxes02: ["#F0FDF4", "#DCFCE7", "#27AE60"],
  boxes03: ["#FEFCE8", "#FEF9C3", "#D4AC0D"],
  boxes04: ["#FEF2F2", "#FEE2E2", "#C0392B"],
};

export const ColorsDark = {
  primary: "#0247D3",
  secondary: "#00174D",
  background: "#111827",
  listItemFill: "#1F2937",
  backgroundgrey: "#020202ff",
  text: "#FFFFFF",
  icons: "#CCCCCC",
  boxes01: ["#1A2B44", "#23456A", "#5A9BFF"],
  boxes02: ["#0F2D23", "#1B4D36", "#27AE60"],
  boxes03: ["#332B0A", "#4D4214", "#FFD700"],
  boxes04: ["#3A1A1A", "#5C2B2B", "#FF5C5C"],
};

export type ThemeMode = "light" | "dark" | "system";
export type ThemeColors = typeof Colors;

export interface ThemeContextValue {
  theme: ThemeColors;
  themeMode: ThemeMode;
  changeTheme: (mode: ThemeMode) => void;
}

// ✅ Exported context
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

// ✅ Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme(); // light/dark
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  // load saved theme
  useEffect(() => {
    AsyncStorage.getItem("themeMode").then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeMode(saved);
      }
    });
  }, []);

  const changeTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    AsyncStorage.setItem("themeMode", mode).catch(() => {});
  };

  const theme = useMemo<ThemeColors>(() => {
    const resolvedMode =
      themeMode === "system"
        ? systemScheme === "dark"
          ? "dark"
          : "light"
        : themeMode;
    return resolvedMode === "dark" ? ColorsDark : Colors;
  }, [themeMode, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Hook for easier consumption
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
