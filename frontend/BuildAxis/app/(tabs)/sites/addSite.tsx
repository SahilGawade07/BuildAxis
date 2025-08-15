import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusable components
import Add_items from "@/components/ui/add_item";
import Back_Text_Butt from "@/components/ui/backBtn";
import { Safe_area } from "@/components/ui/safeArea";
import Submit_bbutt from "@/components/ui/SubmitBtn";
import Upload_img from "@/components/ui/uploadImages";
import { CompanyBar } from "@/app/reusable";
import TextInputs from "@/components/ui/inputField";

export default function CreateTaskScreen() {
  // State for dropdown
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  // State for form inputs
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Safe Area Styling */}
      <Safe_area />

      {/* Top Bar with Logo & Name */}
      <CompanyBar />

      {/* Back Button + Title */}
      <Back_Text_Butt path="" text="Create Task" />

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Task Name Input */}
        <TextInputs
          value={taskName}
          onChangeText={setTaskName}
          placeholder="Task Name"
          keyboardType="default"
          textname="Task Name"
        />

        {/* Description Input */}
        <TextInputs
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          keyboardType="default"
          textname="Description"
        />

        {/* Assign Supervisor Dropdown */}
        <Text style={styles.label}>Assign Supervisor</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSupervisor}
            onValueChange={(itemValue) => setSelectedSupervisor(itemValue)}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Supervisor 1" value="sup1" />
            <Picker.Item label="Supervisor 2" value="sup2" />
          </Picker>
        </View>

        {/* Upload Blueprint Section */}
        <Upload_img />

        {/* Add Labour */}
        <Add_items path="add-labour" text="Add Labour" />

        {/* Assign Supervisor Again (if multiple supervisors) */}
        <Add_items path="assign-supervisor" text="Assign Supervisor" />

        {/* Add Materials */}
        <Add_items path="add-materials" text="Add Materials" />

        {/* Submit Button */}
        <Submit_bbutt text="Assign Task" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  form: {
    paddingHorizontal: 15,
  },

  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 3,
    marginTop: 16,
    fontWeight: "600",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
});
