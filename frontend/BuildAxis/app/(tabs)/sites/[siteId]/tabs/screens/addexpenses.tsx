import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusable components
import Add_items from "@/components/ui/add_item";
import Back_Text_Butt from "@/components/ui/backBtn";
import { Safe_area } from "@/components/ui/safeArea";
import Submit_bbutt from "@/components/ui/SubmitBtn";
import Upload_img from "@/components/ui/uploadImages";
import TextInputs from "@/components/ui/inputField";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";

export default function CreatePaymentScreen() {
  const { theme } = useTheme();

  // State for dropdown
  const [selectedPayment, setSelectedPayment] = useState("");

  // State for form inputs
  const [billName, setBillName] = useState(""); 
  const [vendorName, setVendorName] = useState("");
  const [billDescription, setBillDescription] = useState("");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Custom Safe Area Styling */}
      <Safe_area />

      {/* Back Button + Title */}
<HeaderBar title="Add Expencess" />

      <View style={styles.form}>
        {/* Bill Name Input */}
        <TextInputs
          value={billName}   
          onChangeText={setBillName}
          placeholder="Bill Name"
          keyboardType="default"
          textname="Bill Name"
        />

        {/* Vendor Name Input */}
        <TextInputs
          value={vendorName}
          onChangeText={setVendorName}
          placeholder="Vendor Name"
          keyboardType="default"
          textname="Vendor Name"
        />

        {/* Bill Description Input */}
        <TextInputs
          value={billDescription}
          onChangeText={setBillDescription}
          placeholder="Bill Description"
          keyboardType="default"
          textname="Bill Description"
        />

        {/* Payment Option Dropdown */}
        <Text style={[styles.label, { color: theme.text }]}>Payment Option</Text>
        <View
          style={[
            styles.pickerContainer,
            { borderColor: theme.listItemBorder, backgroundColor: theme.listItemFill },
          ]}
        >
          <Picker
            selectedValue={selectedPayment}
            onValueChange={(itemValue) => setSelectedPayment(itemValue)}
            dropdownIconColor={theme.text}
            style={{ color: theme.text }}
          >
            <Picker.Item label="Select Payment Method" value="" />
            <Picker.Item label="Online" value="online" />
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Cheque" value="cheque" />
          </Picker>
        </View>

        {/* Upload Payment Bills */}
        <Upload_img text="Upload Payment Bills" />

        {/* Optional: Add extra items if needed */}
        <Add_items path="assign-supervisor" text="Attach Additional Docs" />

        {/* Submit Button */}
        <Submit_bbutt text="Submit Payment" />
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
  },

  label: {
    fontSize: 16,
    marginBottom: 3,
    marginTop: 16,
    fontWeight: "600",
  },

  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
});
