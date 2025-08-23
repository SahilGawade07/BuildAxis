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
import TextInputs from "../../../../../components/ui/inputField";
import { ContinueBtn } from "../../../../../components/ui/ContinueBtn";
import { useTheme } from "../../../../../context/ThemeContext";
import Back_Text_Butt from "@/components/ui/backBtn";
import HeaderBar from "@/components/ui/headerBar";
import Upload_img from "@/components/ui/uploadImages";
import Submit_bbutt from "@/components/ui/SubmitBtn";

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
        backgroundColor={theme.primary}
      />

      {/* Header */}


      <HeaderBar title="Add Labours" />


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

               <Upload_img text="Image" />
       

        {/* Submit */}
        {/* <ContinueBtn
          text="Add To Company"
          touchable={true}
          onPresss={handleAddToCompany}
          style={{ backgroundColor: theme.secondary }}
        /> */}

                <Submit_bbutt text="Add to the Company" />

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
