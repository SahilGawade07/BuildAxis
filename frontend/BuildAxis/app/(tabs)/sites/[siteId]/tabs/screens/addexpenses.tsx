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
    paddingTop: 15
  },

  label: {
    fontSize: 16,
    marginBottom: 3,
   
    fontWeight: "600",
  },

  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
});


// import React from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function AddExpenseScreen() {
//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons name="arrow-back" size={22} color="#fff" />
//         <Text style={styles.headerTitle}>Add Expenses</Text>
//       </View>

//       <ScrollView
//         contentContainerStyle={{ padding: 16 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Bill Name */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Bill Name</Text>
//           <TextInput placeholder="Bill Name" style={styles.input} />
//         </View>

//         {/* Vendor Name */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Vendor Name</Text>
//           <TextInput placeholder="Vendor Name" style={styles.input} />
//         </View>

//         {/* Bill Description */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Bill Description</Text>
//           <TextInput
//             placeholder="Bill Description"
//             style={[styles.input, { height: 80 }]}
//             multiline
//           />
//         </View>

//         {/* Payment Option */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Payment Option</Text>
//           <TouchableOpacity style={styles.dropdown}>
//             <Text style={{ color: "#555" }}>Select Payment Method</Text>
//             <Ionicons name="chevron-down" size={20} color="#555" />
//           </TouchableOpacity>
//         </View>

//         {/* Upload Bills */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Upload Payment Bills</Text>
//           <TouchableOpacity style={styles.uploadBox}>
//             <Ionicons name="add" size={28} color="#007bff" />
//           </TouchableOpacity>
//         </View>

//         {/* Attach Docs */}
//         <View style={styles.inputGroup}>
//           <Text style={styles.label}>Attach Additional Docs</Text>
//           <TouchableOpacity style={styles.attachRow}>
//             <Ionicons name="add" size={20} color="#007bff" />
//             <Text style={styles.attachText}>Attach</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Submit Payment</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#0a2e73",
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "600",
//     marginLeft: 12,
//   },
//   inputGroup: {
//     marginBottom: 18,
//   },
//   label: {
//     fontSize: 15,
//     fontWeight: "500",
//     color: "#222",
//     marginBottom: 6,
//   },
//   input: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     fontSize: 15,
//     color: "#000",
//   },
//   dropdown: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   uploadBox: {
//     height: 100,
//     width: 100,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#bbb",
//     borderStyle: "dashed",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   attachRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   attachText: {
//     marginLeft: 6,
//     fontSize: 15,
//     color: "#007bff",
//     fontWeight: "500",
//   },
//   button: {
//     backgroundColor: "#007bff",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     marginTop: 10,
//     shadowColor: "#007bff",
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });
