import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TextInputs from "../../components/ui/inputField";
import { ContinueBtn } from "../../components/ui/ContinueBtn";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppLogo = () => (
  <View style={styles.logoContainer}>
    <View style={styles.logoWrapper}>
      <Image
        source={require("@/assets/images/logo.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.plusIcon}>
        <FontAwesome6 name="add" size={16} color="#1976D2" />
      </View>
    </View>
  </View>
);

export default function AddOrganizationScreen() {
  const router = useRouter();

  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddOrganization = async () => {
    if (!orgName || !email || !phone || !address) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Simulated API call (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store organization info in AsyncStorage
      const orgData = {
        orgName: orgName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem("organizationInfo", JSON.stringify(orgData));

      Alert.alert("Success", "Organization created successfully!", [
        {
          text: "Continue",
          onPress: () => {
            router.replace("/(tabs)/home");
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating organization:", error);
      Alert.alert("Error", "Failed to create organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = orgName && email && phone && address;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 40}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centeredContent}>
            {/* Logo with Add Icon */}
            <AppLogo />

            {/* Headers */}
            <Text style={styles.headerTop}>Create Organization</Text>
            <Text style={styles.subHeader}>
              Create your organization profile to get started with BuildAxis
            </Text>

            {/* Form */}
            <View style={styles.form}>
              <TextInputs
                value={orgName}
                onChangeText={setOrgName}
                placeholder="Enter organization name"
                keyboardType="default"
                textname="Organization Name"
              />

              <TextInputs
                value={email}
                onChangeText={setEmail}
                placeholder="Enter organization email"
                keyboardType="email-address"
                textname="Email"
              />

              <TextInputs
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                textname="Phone Number"
              />

              <TextInputs
                value={address}
                onChangeText={setAddress}
                placeholder="Enter organization address"
                keyboardType="default"
                textname="Address"
              />

              {/* Add Organization Button */}
              <ContinueBtn
                text={loading ? "Creating..." : "Create Organization"}
                touchable={isFormValid && !loading}
                onPresss={handleAddOrganization}
              />

              {/* Skip Button */}
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => router.push("/(tabs)/home")}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>

            {/* Helper Text */}
            <Text style={styles.helperText}>
              You can always add this information later in your profile settings
            </Text>
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
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  centeredContent: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoWrapper: {
    position: "relative",
    backgroundColor: "#e3f2fd",
    borderRadius: 50,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 46,
  },
  plusIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#fff",
    borderRadius: 18,
    height: 36,
    width: 36,
    borderWidth: 2,
    borderColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    marginBottom: 40,
    lineHeight: 22,
    maxWidth: 300,
  },
  form: {
    width: "100%",
    maxWidth: 320,
  },
  skipButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  skipButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 24,
    lineHeight: 20,
    maxWidth: 280,
  },
});
