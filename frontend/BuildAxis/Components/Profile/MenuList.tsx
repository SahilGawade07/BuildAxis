import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Props for a single menu item
interface MenuItemProps {
  iconName: React.ComponentProps<typeof Ionicons>["name"]; // e.g., "settings-outline"
  menuItemName: string;
  onPress?: () => void;
}

// Props for the Menu component
interface MenuProps {
  items: MenuItemProps[];
}

const Menu = ({ items }: MenuProps) => {
  return (
    <View style={styles.menuContainer}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={item.onPress}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={item.iconName} size={24} color="#6366f1" />
          </View>
          <Text style={styles.menuText}>{item.menuItemName}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
    borderBottomColor: "#f1f5f9",
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
    color: "#1f2937",
    fontWeight: "400",
  },
  chevron: {
    fontSize: 18,
    color: "#d1d5db",
    fontWeight: "300",
  },
});

export default Menu;
