import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import React from "react";
import { router, useRouter } from "expo-router";
const LogoutButton = () => {
  const router = useRouter();
  return (
    <View>
      <TouchableOpacity
        style={styles.logout}
        onPress={() => {
          router.push("/theme");
        }}
      >
        <Text style={styles.logoutText}> Logout</Text>
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
