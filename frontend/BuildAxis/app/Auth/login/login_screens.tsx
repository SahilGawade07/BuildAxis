import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router"; 

// Importing custom reusable components
import { TextHeaderTop } from "../common/login_header";
import { TextInputs } from "../common/input_textbox";
import { PasswordTextInputs } from "../common/input_pass_textbox";
import { TextHeaderSecondTop } from "../common/second_top_header";
import { Continue } from "../common/continue_button";
import { Signup_with } from "../common/Signup_with";
import { SwitchScreens } from "../common/switch_to_signup";

export default function LoginScreen() {
  const router = useRouter(); 

  // State variables
  const [email, setEmail] = useState(""); // Stores email input
  const [password, setPassword] = useState(""); // Stores password input
  const [continueDisabled, setContinueDisabled] = useState(true); // Controls Continue button enable/disable
  const [err, setError] = useState(""); // Stores validation error messages

  // Runs every time email or password changes
  useEffect(() => {
    setError(""); // Clear any previous error
    setContinueDisabled(true); // Disable button by default

    // Validation: Disable button if fields are empty or invalid
    if (!email || !password) return;
    if (!email.includes("@") || !email.includes(".")) return;
    if (password.length < 6) return;

    // If all validations pass → enable Continue button
    setContinueDisabled(false);
  }, [email, password]);

  // Called when user presses the Continue button
  const handleSignup = () => {
    setError(""); // Clear error before checking

    // Field validation
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

    // If valid  proceed to submission
    handleSubmit();
  };

  // Function to navigate to signup screen
  const handleSubmit = () => {
    router.push("/Auth/sign_up/sign_up");
  };

  return (
    <View style={styles.container}>
      {/* Top heading */}
      <TextHeaderTop text="Login" />

      {/* Subheading */}
      <TextHeaderSecondTop text="Join our community and experience a seamless way of finding your relationship" />

      {/* Email Input */}
      <TextInputs
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your Email"
        keyboardType="email-address"
        textname="Email"
      />

      {/* Password Input */}
      <PasswordTextInputs
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your Password"
        keyboardType="default"
        textname="Password"
      />

      {/* Forgot Password Link */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Error message */}
      {err ? <Text style={styles.error}>{err}</Text> : null}

      {/* Continue Button */}
      <Continue
        text="Login in"
        touchable={continueDisabled} // This controls button disable state
        onPresss={handleSignup}
      />

      {/* Divider: OR */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Social Login buttons */}
      <Signup_with name="logo-apple" text="Login with Apple" />
      <Signup_with name="logo-google" text="Login with Google" />

      {/* Switch to Register Screen link */}
      <SwitchScreens
        text1="Haven't registered yet?"
        text2="Register"
        path="/Auth/sign_up/sign_up"
      />
    </View>
  );
}

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    marginTop: 25,
    backgroundColor: "#fff",
  },
  forgotText: {
    alignSelf: "flex-end",
    marginTop: 8,
    color: "#999",
    fontSize: 14,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    marginHorizontal: 12,
    color: "#999",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginTop: 8,
    fontSize: 14,
  },
});
