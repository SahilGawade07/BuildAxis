



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
import { CompanyBar } from "@/components/ui/orgNameBar";
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

      {/* Top Bar with Logo & Name */}
      <HeaderBar title="Create a task" />

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
        <Text style={[styles.label, { color: theme.text }]}>Assign Supervisor</Text>
        <View
          style={[
            styles.pickerContainer,
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
        <Upload_img text="Upload site Banner"/>

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
  },

  form: {
    paddingHorizontal: 15,
    paddingTop:15
  },

  label: {
    fontSize: 16,
    marginBottom: 3,
   
    fontWeight: "500",
  },

  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
});
