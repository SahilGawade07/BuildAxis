import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Import reusable components
import { TopTextHeader } from "@/components/ui/topHeaderText";
import { TextInputs } from "../../components/ui/inputField";
import { PasswordField } from "../../components/ui/passwordField";
import { ContinueBtn } from "../../components/ui/ContinueBtn";
import { SwitchScreens } from "../../components/ui/switch_to_signup";

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
    setError("");
    setContinueDisabled(true);

    if (!email || !password) return;
    if (!email.includes("@") || !email.includes(".")) return;
    if (password.length < 6) return;

    setContinueDisabled(false);
  }, [email, password]);

  const handleLogin = () => {
    setError("");
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Invalid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Navigate to next screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />{" "}
      <View style={styles.centeredContent}>
        {/* Logo */}
        <AppLogo />

        {/* Headers */}
        <TopTextHeader text="Welcome Back" style={styles.headerTop} />
        <Text style={styles.subHeader}>Log in to your BuildAxis account</Text>

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
            textname="Password"
            icon="lock-closed-outline"
          />

          {/* Forgot Password */}
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Error Message */}
          {err ? <Text style={styles.error}>{err}</Text> : null}

          {/* Continue Button */}
          <ContinueBtn
            text="Continue"
            touchable={!continueDisabled}
            onPresss={handleLogin}
          />
        </View>

        {/* Sign Up Link */}
        <SwitchScreens
          text1="Don’t have an account?"
          text2="Sign up"
          path="/Auth/sign_up/sign_up"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9fb",
    paddingHorizontal: 24,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
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
    maxWidth: 320, // Keeps form narrow and centered on larger screens
  },
  forgotText: {
    fontSize: 14,
    color: "#1976D2", // Google Blue
    textAlign: "right",
    marginTop: 8,
    fontWeight: "500",
  },
  error: {
    color: "#D32F2F", // Material Red
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#BDBDBD",
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  socialButtons: {
    gap: 12,
    marginBottom: 20,
  },
});
