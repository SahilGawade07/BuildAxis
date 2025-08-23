import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Topbar from "@/components/Sites/popupScreens/common/topBar";
import  TextInputs  from "@/components/ui/inputField";
import { useTheme } from "@/context/ThemeContext";
import Submit_bbutt from "@/components/ui/SubmitBtn";

export default function Addtools({ fun,header,buttontxt }: any) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [remark, setRemark] = useState("");

  const { theme } = useTheme();

  return (
    <View style={[styles.modal, { backgroundColor: theme.listItemFill }]}>
      {/* Header */}
      <Topbar text={header} funs={fun} />

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
 <Submit_bbutt text={buttontxt}/>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
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
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
