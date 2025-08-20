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
import Ionicons from "@expo/vector-icons/Ionicons";

// Reusable Components
import TextInputs  from "../../../../../components/ui/inputField";
import { ContinueBtn } from "../../../../../components/ui/ContinueBtn";
import { useTheme } from "../../../../../context/ThemeContext";

export default function LabourDetailsScreen() {
  const router = useRouter();
  const { theme } = useTheme();

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.profileHeader}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.profileHeader }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="chevron-back" size={30} color={theme.text} />
          </View>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Labour Details
        </Text>
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
        <Text style={[styles.label, { color: theme.text }]}>Upload Photo</Text>
        <TouchableOpacity
          style={[
            styles.uploadBox,
            { borderColor: theme.listItemBorder, backgroundColor: theme.listItemFill },
          ]}
          onPress={handlePickImage}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.uploadedImage} />
          ) : (
            <Text style={[styles.plus, { color: theme.secondary }]}>+</Text>
          )}
        </TouchableOpacity>

        {/* Error */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Submit */}
        <ContinueBtn
          text="Add To Company"
          touchable={true}
          onPresss={handleAddToCompany}
          style={{ backgroundColor: theme.secondary }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  form: { marginTop: 16, paddingHorizontal: 16 },
  label: { fontSize: 14, marginBottom: 8, marginTop: 16 },
  uploadBox: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  plus: { fontSize: 28 },
  uploadedImage: { width: "100%", height: "100%", borderRadius: 6 },
  error: { color: "red", marginTop: 8 },
});
