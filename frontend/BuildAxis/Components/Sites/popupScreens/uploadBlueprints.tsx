import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Topbar from "@/components/Sites/popupScreens/common/topBar";
import  TextInputs  from "@/components/ui/inputField";
import { useTheme } from "@/context/ThemeContext";

export default function Uploadblueprints({ fun }: any) {
  const [email, setemail] = useState("");
  const [correct, setcorrect] = useState(true);

  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.modal,
        { backgroundColor: theme.listItemFill }, // dynamic background
      ]}
    >
      {/* Header */}
      <Topbar text="Upload Attachments" funs={fun} />

      {correct && (
        <View>
          {/* File Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.secondary }]}
            onPress={() => setcorrect(!correct)}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Choose from file
            </Text>
          </TouchableOpacity>

          {/* Camera Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.secondary }]}
            onPress={() => setcorrect(!correct)}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Click From Camera
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!correct && (
        <View>
          <TextInputs
            value={email}
            onChangeText={setemail}
            placeholder="Item Name"
            keyboardType="email-address"
            textname="Item Name"
          />
          <TextInputs
            value={email}
            onChangeText={setemail}
            placeholder="Item Name"
            keyboardType="email-address"
            textname="Item Name"
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.secondary }]}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Upload Attachment
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
