import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusable components
import Add_items from "@/components/ui/add_item";
import { Safe_area } from "@/components/ui/safeArea";
import Submit_bbutt from "@/components/ui/SubmitBtn";
import Upload_img from "@/components/ui/uploadImages";
import TextInputs from "@/components/ui/inputField";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";

export default function CreateTaskScreen() {
  const { theme } = useTheme();

  // State for dropdown
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  // State for form inputs
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Safe Area Styling */}
      <Safe_area />

      {/* Back Button + Title */}
      <HeaderBar title="Create a New Site" />
    

      <View style={styles.form} >
        {/* Task Name Input */}
        <TextInputs
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Site Name"
  
          keyboardType="default"
          textname="Site Name"
        />

        {/* Description Input */}
        <TextInputs
          value={description}
          onChangeText={setDescription}
          placeholder="Address"
          keyboardType="default"
          textname="Address"
        />

        {/* Assign Supervisor Dropdown */}
        <Text style={[styles.label, { color: theme.text }]}>Add Patners</Text>
        <View style={[styles.pickerContainer,
            { borderColor: theme.listItemBorder, backgroundColor: theme.listItemFill },
          ]}
        >
          <Picker
            selectedValue={selectedSupervisor}
            onValueChange={(itemValue) => setSelectedSupervisor(itemValue)}
            dropdownIconColor={theme.text}
            style={{ color: theme.text }}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Supervisor 1" value="sup1" />
            <Picker.Item label="Supervisor 2" value="sup2" />
          </Picker>
        </View>

        {/* Upload Blueprint Section */}
        <Upload_img text="Site Banner" />

        {/* Assign Supervisor Again (if multiple supervisors) */}
        <Add_items path="assign-supervisor" text="Assign Supervisor" />

        {/* Submit Button */}
        <Submit_bbutt text="Create Site" />
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  form: {
    paddingHorizontal: 15,
    paddingVertical:15
  },

  label: {
    fontSize: 15,
    marginBottom: 3,
    fontWeight: "500",
  },

  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
});