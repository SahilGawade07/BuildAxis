import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Topbar from "@/components/Sites/popupScreens/common/topBar";
import { TextInputs } from "@/components/ui/inputField";

export default function Addtools({ fun }: any) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [remark, setRemark] = useState("");

  return (
    <View style={styles.modal}>
      {/* Header */}
      <Topbar text="Add Tools" funs={fun} />

      {/* Input Fields */}
      <TextInputs
        value={itemName}
        onChangeText={setItemName}
        placeholder="Item Name"
        keyboardType="default"
        textname="Item Name"
      />
      <TextInputs
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Enter the Quantity"
        keyboardType="numeric"
        textname="Quantity"
      />
      <TextInputs
        value={category}
        onChangeText={setCategory}
        placeholder="Enter the Category"
        keyboardType="default"
        textname="Category"
        icon="mail-outline"
      />
      <TextInputs
        value={remark}
        onChangeText={setRemark}
        placeholder="Remark"
        keyboardType="default"
        textname="Remark"
      />

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add Tools</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "95%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#0066ff",
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
