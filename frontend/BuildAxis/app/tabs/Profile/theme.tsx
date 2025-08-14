import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { ThemeProvider, ThemeContext } from "../../../context/ThemeContext";

function HomeScreen() {
  const { theme, themeMode, changeTheme } = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.text }}>Current Theme: {themeMode}</Text>
      <Button title="Light Mode" onPress={() => changeTheme("light")} />
      <Button title="Dark Mode" onPress={() => changeTheme("dark")} />
      <Button title="System Default" onPress={() => changeTheme("system")} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}
