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
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { TextInputs } from "../common/input_textbox";
import { Continue } from "../common/continue_button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handleAddOrganization = () => {
    if (!orgName || !email || !phone || !address) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    Alert.alert("Success", "Organization added successfully!");
    router.push("/tabs/Profile/profile");
  };

  const isFormValid = orgName && email && phone && address;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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
              icon="business-outline"
            />

            <TextInputs
              value={email}
              onChangeText={setEmail}
              placeholder="Enter organization email"
              keyboardType="email-address"
              textname="Email"
              icon="mail-outline"
            />

            <TextInputs
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              textname="Phone Number"
              icon="call-outline"
            />

            <TextInputs
              value={address}
              onChangeText={setAddress}
              placeholder="Enter organization address"
              keyboardType="default"
              textname="Address"
              icon="location-outline"
            />

            {/* Add Organization Button */}
            <Continue
              text="Create Organization"
              touchable={isFormValid}
              onPresss={handleAddOrganization}
            />

            {/* Skip Button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.push("/tabs/Home/home")}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9fb",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
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
