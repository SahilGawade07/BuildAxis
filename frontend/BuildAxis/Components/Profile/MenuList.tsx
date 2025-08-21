import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/context/ThemeContext"; // adjust import path if needed

// Extend props to include componentName
interface MenuItemProps {
  componentName?: "Ionicons" | "MaterialIcons"; // Add more if needed
  iconName: string;
  menuItemName: string;
  onPress?: () => void;
}

interface MenuProps {
  items: MenuItemProps[];
}

// Map component names to actual icon components
const iconComponents: Record<string, any> = {
  Ionicons,
  MaterialIcons,
};

const Menu = ({ items }: MenuProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.menuContainer,
        { backgroundColor: theme.listItemFill, shadowColor: theme.text },
      ]}
    >
      {items.map((item, index) => {
        const IconComponent = iconComponents[item.componentName || "Ionicons"]; // default Ionicons

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              { borderBottomColor: theme.sepratorLine },
              index === items.length - 1 && styles.lastMenuItem,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.iconContainer}>
              <IconComponent
                name={item.iconName}
                size={24}
                color={theme.secondary}
              />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>
              {item.menuItemName}
            </Text>
            <Text style={[styles.chevron, { color: theme.icons }]}>›</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    borderRadius: 15,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 24,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
  chevron: {
    fontSize: 18,
    fontWeight: "300",
  },
});

export default Menu;
