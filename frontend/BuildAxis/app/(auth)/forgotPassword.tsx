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

// Reusable components
import { TopTextHeader } from "@/components/ui/topHeaderText";
import TextInputs  from "@/components/ui/inputField";
import { ContinueBtn } from "@/components/ui/ContinueBtn";

const AppLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("@/assets/images/logo.jpg")}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [err, setError] = useState("");

  useEffect(() => {
    setError("");
    setContinueDisabled(true);

    if (!email) return;
    if (!email.includes("@") || !email.includes(".")) return;

    setContinueDisabled(false);
  }, [email]);

  const handleResetPassword = () => {
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Invalid email address");
      return;
    }

    // Handle API request here (send reset link etc.)
    // For now, navigate back to login
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.centeredContent}>
        {/* Logo */}
        <AppLogo />

        {/* Headers */}
        <TopTextHeader text="Forgot Password?" style={styles.headerTop} />
        <Text style={styles.subHeader}>
          Enter your email to reset your password
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

          {/* Error Message */}
          {err ? <Text style={styles.error}>{err}</Text> : null}

          {/* Continue Button */}
          <ContinueBtn
            text="Send Reset Link"
            touchable={!continueDisabled}
            onPresss={handleResetPassword}
          />
        </View>

        {/* Back to login */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={{ marginTop: 16 }}
        >
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
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
    justifyContent: "center",
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
  error: {
    color: "#D32F2F",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  backText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
    textAlign: "center",
  },
});
