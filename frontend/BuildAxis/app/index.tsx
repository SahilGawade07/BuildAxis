import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        setTimeout(() => {
          if (token) {
            router.replace("/(tabs)/home");
          } else {
            router.replace("/(auth)/onboarding");
            // router.replace("/(tabs)/home");
          }
        }, 0);
      } catch (error) {
        console.error("Error checking login status:", error);
        router.replace("/(auth)/onboarding");
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginRight: 50,
  },
});

export default SplashScreen;

// export default function Index() {
//   return <Redirect href="/(tabs)/home" />;
// }
