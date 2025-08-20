import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userInfo"]);

      Alert.alert("Success", "Logged out successfully", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(auth)/login");
          },
        },
      ]);
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const showLogoutConfirmation = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: handleLogout,
      },
    ]);
  };

  return (
    <View>
      <TouchableOpacity style={styles.logout} onPress={showLogoutConfirmation}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logout: {
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 30,
    backgroundColor: "#ef4444", // base red
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default LogoutButton;
