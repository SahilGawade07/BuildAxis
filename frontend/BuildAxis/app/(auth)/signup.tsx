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

import { TopTextHeader } from "@/components/ui/topHeaderText";
import { TextInputs } from "../../components/ui/inputField";
import { PasswordField } from "../../components/ui/passwordField";
import { ContinueBtn } from "../../components/ui/ContinueBtn";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { signUpRequest } from "@/lib/api";

const AppLogo = () => (
  <View style={styles.logoContainer}>
    <Image
      source={require("../../assets/images/logo.jpg")}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

export default function SignUpScreen() {
  const router = useRouter();

  // State for fields
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [err, setError] = useState("");

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;
    const isConfirmValid =
      confirmPassword === password && confirmPassword.length > 0;
    const isNameValid = fName.trim().length > 1 && lName.trim().length > 1;
    const isPhoneValid = phone.trim().length >= 8;

    setContinueDisabled(
      !(
        isEmailValid &&
        isPasswordValid &&
        isConfirmValid &&
        isNameValid &&
        isPhoneValid
      )
    );
  }, [fName, lName, email, phone, password, confirmPassword]);

  const handleSignUp = async () => {
    setError("");
    if (!fName || !lName || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await signUpRequest({
        fName,
        lName,
        email,
        phone,
        password,
        role: "promoter", // fixed
        // profilePic:
        //   "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      });

      if (result.accessToken) {
        await AsyncStorage.setItem("userToken", result.accessToken);
      }
      if (result.data) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(result.data));
      }

      router.replace("/(tabs)/home");
    } catch (error: any) {
      setError(error?.message || "Sign up failed");
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
            <AppLogo />

            <TopTextHeader text="Create Account" style={styles.headerTop} />
            <Text style={styles.subHeader}>
              Sign up as promoter to start managing your projects
            </Text>

            <View style={styles.form}>
              <TextInputs
                value={fName}
                onChangeText={setFName}
                placeholder="Enter your first name"
                textname="First Name"
                icon="person-outline"
              />

              <TextInputs
                value={lName}
                onChangeText={setLName}
                placeholder="Enter your last name"
                textname="Last Name"
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

              <TextInputs
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                textname="Phone"
                icon="call-outline"
              />

              <PasswordField
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                textname="Password"
                icon="lock-closed-outline"
              />

              <PasswordField
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                textname="Confirm Password"
                icon="lock-closed-outline"
              />

              {err ? <Text style={styles.error}>{err}</Text> : null}

              <ContinueBtn
                text="Sign Up"
                touchable={!continueDisabled}
                onPresss={handleSignUp}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.smallText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.registerText}> Login</Text>
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
});
