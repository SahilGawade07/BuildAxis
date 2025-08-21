import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Import reusable components
import { TopTextHeader } from "@/components/ui/topHeaderText";
import TextInputs from "../../components/ui/inputField";
import PasswordField from "../../components/ui/passwordField";
import { ContinueBtn } from "../../components/ui/ContinueBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInRequest } from "@/lib/api";

const AppLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("../../assets/images/logo.jpg")}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [err, setError] = useState("");

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;
    setContinueDisabled(!(isEmailValid && isPasswordValid));
  }, [email, password]);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await signInRequest(email, password);

      if (result.accessToken) {
        await AsyncStorage.setItem("userToken", result.accessToken);
      }
      if (result.refreshToken) {
        await AsyncStorage.setItem("refreshToken", result.refreshToken);
      }
      if (result.data) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(result.data));
      }

      router.replace("/(tabs)/home");
    } catch (error: any) {
      setError(error?.message || "Login failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centeredContent}>
            {/* Logo */}
            <AppLogo />

            {/* Headers */}
            <TopTextHeader text="Welcome Back" style={styles.headerTop} />
            <Text style={styles.subHeader}>
              Log in to your BuildAxis account
            </Text>

            {/* Form */}
            <View style={styles.form}>
              <TextInputs
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                textname="Email"
                icon="mail-outline"
              />

              <PasswordField
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
              />

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() => {
                  router.push("/(auth)/forgotPassword");
                }}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Error Message */}
              {err ? <Text style={styles.error}>{err}</Text> : null}

              {/* Continue Button */}
              <ContinueBtn
                text="Login"
                touchable={!continueDisabled}
                onPress={handleLogin} // ✅ fixed
              />
            </View>

            {/* Sign Up */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={styles.smallText}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text style={styles.registerText}>{" Sign up"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9fb",
    paddingHorizontal: 24,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  centeredContent: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    padding: 8,
  },
  headerTop: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  form: {
    width: "100%",
    maxWidth: 320,
  },
  forgotText: {
    fontSize: 14,
    color: "#1976D2",
    textAlign: "right",
    marginTop: 8,
    fontWeight: "500",
  },
  error: {
    color: "#D32F2F",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  smallText: {
    color: "#666",
    fontSize: 14,
  },
  registerText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
