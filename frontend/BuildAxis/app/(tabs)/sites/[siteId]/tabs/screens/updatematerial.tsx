// app/edit-material.tsx
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

// Reusable components
import Back_Text_Butt from "@/components/ui/backBtn";
import TextInputs from "@/components/ui/inputField";
import Submit_bbutt from "@/components/ui/SubmitBtn";
import { useTheme } from "@/context/ThemeContext";

export default function EditMaterialScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Get params from MaterialList
  const { id, name, quantity, unit } = useLocalSearchParams<{
    id: string;
    name: string;
    quantity: string;
    unit: string;
  }>();

  // Local state for editing
  const [materialName, setMaterialName] = useState(name || "");
  const [materialQty, setMaterialQty] = useState(quantity || "");
  const [materialUnit, setMaterialUnit] = useState(unit || "");

  const handleUpdate = () => {
    // Save changes to backend / state
    console.log("Updated:", { id, materialName, materialQty, materialUnit });

    // Go back to list after update
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Back_Text_Butt path="/(tabs)/sites" text="Edit Material" />

      <View style={styles.form}>
        <TextInputs
          value={materialName}
          onChangeText={setMaterialName}
          placeholder="Material Name"
          textname="Material Name"
        />
        <TextInputs
          value={materialQty.toString()}
          onChangeText={setMaterialQty}
          placeholder="Quantity"
          textname="Quantity"
          keyboardType="numeric"
        />
        <TextInputs
          value={materialUnit}
          onChangeText={setMaterialUnit}
          placeholder="Unit (e.g. pcs, bags, trucks)"
          textname="Unit"
        />

        <Submit_bbutt text="Update Material" onPress={handleUpdate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { paddingHorizontal: 15, marginTop: 20 },
});
