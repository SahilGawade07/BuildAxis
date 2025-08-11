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
import { TextHeaderTop } from "../common/login_header";
import { TextInputs } from "../common/input_textbox";
import { PasswordTextInputs } from "../common/input_pass_textbox";
import { Continue } from "../common/continue_button";
import { SwitchScreens } from "../common/switch_to_signup";

const AppLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("../../../assets/images/logo.jpg")}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

export default function SignUpScreen() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [err, setError] = useState("");

  // Validate form and enable/disable button
  useEffect(() => {
    setError("");
    setContinueDisabled(true);

    if (!name || !email || !password || !confirmPassword) return;
    if (!email.includes("@") || !email.includes(".")) return;
    if (password.length < 6) return;
    if (password !== confirmPassword) return;

    setContinueDisabled(false);
  }, [name, email, password, confirmPassword]);

  // Handle sign-up submission
  const handleSignup = () => {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    handleSubmit();
  };

  // Navigate after validation
  const handleSubmit = () => {
    router.push("/Auth/create_org/create_org");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.centeredContent}>
        {/* Logo */}
        <AppLogo />

        {/* Headers */}
        <TextHeaderTop text="Create Account" style={styles.headerTop} />
        <Text style={styles.subHeader}>
          Let&apos;s get you started! Please fill in the details below.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <TextInputs
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            keyboardType="default"
            textname="Name"
            icon="person-outline"
          />

          <TextInputs
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            textname="Email"
            icon="mail-outline"
          />

          <PasswordTextInputs
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            textname="Password"
            icon="lock-closed-outline"
          />

          <PasswordTextInputs
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            textname="Confirm Password"
            icon="lock-closed-outline"
          />

          {/* Error Message */}
          {err ? <Text style={styles.error}>{err}</Text> : null}

          {/* Sign Up Button */}
          <Continue
            text="Sign Up"
            touchable={!continueDisabled}
            onPresss={handleSignup}
          />
        </View>

        {/* Switch to Login */}
        <SwitchScreens
          text1="Already have an account?"
          text2="Log in"
          path="/Auth/create_org/create_org"
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
  error: {
    color: "#D32F2F", // Material Red
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
