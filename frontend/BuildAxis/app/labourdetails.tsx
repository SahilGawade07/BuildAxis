import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import Ionicons from '@expo/vector-icons/Ionicons';

// Reusable Components
import { TextInputs } from "./Auth/common/input_textbox";
import { Continue } from "./Auth/common/continue_button";

export default function LabourDetailsScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleAddToCompany = () => {
    setError("");
    if (!firstName || !lastName || !phone || !role) {
      setError("Please fill all fields");
      return;
    }
    // Save details logic here...
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002B5B" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="chevron-back" size={30} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Labour Details</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInputs
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter the first name"
          textname="First Name"
        />
        <TextInputs
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter the Last name"
          textname="Last Name"
        />
        <TextInputs
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter the Phone No."
          keyboardType="phone-pad"
          textname="Phone No."
        />
        <TextInputs
          value={role}
          onChangeText={setRole}
          placeholder="Select the Role"
          textname="Role"
        />

        {/* Upload Photo */}
        <Text style={styles.label}>Upload Photo</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.uploadedImage} />
          ) : (
            <Text style={styles.plus}>+</Text>
          )}
        </TouchableOpacity>

        {/* Error */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Submit */}
        <Continue
          text="Add To Company"
          touchable={true}
          onPresss={handleAddToCompany}
          style={{ backgroundColor: "#3c64a4ff" }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    backgroundColor: "#002B5B",
    paddingHorizontal: 12,
  },
  backArrow: { color: "#fff", fontSize: 20, marginRight: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  form: { marginTop: 16, paddingHorizontal: 16 },
  label: { fontSize: 14, color: "#555", marginBottom: 8, marginTop: 16 },
  uploadBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  plus: { fontSize: 28, color: "#1976D2" },
  uploadedImage: { width: "100%", height: "100%", borderRadius: 6 },
  error: { color: "red", marginTop: 8 },
});
