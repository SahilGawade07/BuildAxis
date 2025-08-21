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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopTextHeader } from "@/components/ui/topHeaderText";
import TextInputs from "../../components/ui/inputField";
import PasswordField from "@/components/ui/passwordField";
import { ContinueBtn } from "../../components/ui/ContinueBtn";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { signupRequest } from "@/lib/api";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = password.length >= 6;
    const isConfirmValid =
      confirmPassword === password && confirmPassword.length > 0;
    const isNameValid = fName.trim().length > 1 && lName.trim().length > 1;
    const isPhoneValid = phone.trim().length >= 10;

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

    // Validation
    if (!fName || !lName || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (fName.trim().length < 2 || lName.trim().length < 2) {
      setError("First and last names must be at least 2 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (phone.trim().length < 10) {
      setError("Phone number must be at least 10 digits");
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

    try {
      setLoading(true);
      const result = await signupRequest({
        fName: fName.trim(),
        lName: lName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: "promoter",
      });

      if (result.accessToken) {
        await AsyncStorage.setItem("userToken", result.accessToken);
      }
      if (result.refreshToken) {
        await AsyncStorage.setItem("refreshToken", result.refreshToken);
      }
      if (result.data) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(result.data));
      }

      Alert.alert("Success", "Account created successfully! Now create your organization.", [
        {
          text: "Continue",
          onPress: () => {
            // Redirect to create organization page instead of home
            router.replace("/(auth)/createOrg");
          },
        },
      ]);
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error?.message || "Sign up failed");
    } finally {
      setLoading(false);
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

              <PasswordField value={password} onChangeText={setPassword} />

              <PasswordField value={confirmPassword} label="Confirm Password" placeholder="Confirm your password"onChangeText={setConfirmPassword} />

              {err ? <Text style={styles.error}>{err}</Text> : null}

              <ContinueBtn
                text={loading ? "Creating Account..." : "Sign Up"}
                touchable={!continueDisabled && !loading}
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
