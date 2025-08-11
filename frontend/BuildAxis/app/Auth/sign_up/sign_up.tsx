import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router"; 

import { TextHeaderTop } from "../common/login_header";
import { TextInputs } from "../common/input_textbox";
import { PasswordTextInputs } from "../common/input_pass_textbox";
import { TextHeaderSecondTop } from "../common/second_top_header";
import { Continue } from "../common/continue_button";
import { SwitchScreens } from "../common/switch_to_signup";

export default function SignUpScreen() {
  const router = useRouter(); 

  // Separate states for each field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [err, setError] = useState("");

  // Enable/disable continue button based on validation
  useEffect(() => {
    setError("");
    setContinueDisabled(true);

    if (!name || !email || !password || !confirmPassword) return;
    if (!email.includes("@") || !email.includes(".")) return;
    if (password.length < 6) return;
    if (password !== confirmPassword) return;

    setContinueDisabled(false);
  }, [name, email, password, confirmPassword]);

  // Validate inputs when pressing continue
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

  // Navigate to next screen
  const handleSubmit = () => {
    router.push("/Auth/create_org/create_org");
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <TextHeaderTop text="Sign up" />

      {/* Subheader */}
      <TextHeaderSecondTop text="Let’s get you started on your journey! Please fill out the form below to create your account" />

      {/* Name Input */}
      <TextInputs
        value={name}
        onChangeText={setName}
        placeholder="Siddharth Chemte"
        keyboardType="default"
        textname="Name"
      />

      {/* Email Input */}
      <TextInputs
        value={email}
        onChangeText={setEmail}
        placeholder="abc@gmail.com"
        keyboardType="email-address"
        textname="Email"
      />

      {/* Password Input */}
      <PasswordTextInputs
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        keyboardType="default"
        textname="Password"
      />

      {/* Confirm Password Input */}
      <PasswordTextInputs
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        keyboardType="default"
        textname="Password Verification"
      />

      {/* Error Message */}
      {err ? <Text style={styles.error}>{err}</Text> : null}

      {/* Continue Button */}
      <Continue
        text="Sign Up"
        touchable={continueDisabled}
        onPresss={handleSignup}
      />

      {/* Switch to Login */}
      <SwitchScreens
        text1="Already have an account?"
        text2="Log in"
        path="/Auth/create_org/create_org"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    marginTop: 25,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginTop: 8,
    fontSize: 14,
  },
});
