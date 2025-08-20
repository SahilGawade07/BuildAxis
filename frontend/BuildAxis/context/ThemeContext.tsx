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
  listItemBorder: "#b2b2b2",
  backgroundgrey: "#F5F5F5",
  sepratorLine: "#b2b2b2",
  text: "#000000",
  icons: "#999",
  profileHeader: "#008fcdff",
  activeTabIcon: "#000000ff",
  boxes01: ["#DBEDFD", "#B6DEFF", "#4682B4"],
  boxes02: ["#F0FDF4", "#DCFCE7", "#27AE60"],
  boxes03: ["#FEFCE8", "#FEF9C3", "#D4AC0D"],
  boxes04: ["#FEF2F2", "#FEE2E2", "#C0392B"],
};

export const ColorsDark = {
  primary: "#00174D",
  secondary: "#0247D3",
  background: "#111827",
  listItemFill: "#1F2937",
  listItemBorder: "#1F2937",
  backgroundgrey: "#020202ff",
  sepratorLine: "#3a3a3a",
  text: "#FFFFFF",
  icons: "#CCCCCC",
  profileHeader: "#003b54ff",
  activeTabIcon: "#ffffffff",
  boxes01: ["#2e62b5ff", "#4f8ef7", "#ffffff"],
  boxes02: ["#24a259ff", "#3db670", "#ffffff"],
  boxes03: ["#f39c12", "#f4a62a", "#ffffff"],
  boxes04: ["#c0392b", "#c64d40", "#ffffff"],
};

export type ThemeMode = "light" | "dark" | "system";
export type ThemeColors = typeof Colors & { isDark: boolean };

export interface ThemeContextValue {
  theme: ThemeColors;
  themeMode: ThemeMode;
  changeTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

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

    const baseTheme = resolvedMode === "dark" ? ColorsDark : Colors;

    return {
      ...baseTheme,
      isDark: resolvedMode === "dark", // ✅ Add this flag
    };
  }, [themeMode, systemScheme]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
