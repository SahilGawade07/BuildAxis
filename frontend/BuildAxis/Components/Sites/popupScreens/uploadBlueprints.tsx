import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Topbar from "@/components/Sites/popupScreens/common/topBar";
import TextInputs from "@/components/ui/inputField";
import { useTheme } from "@/context/ThemeContext";
import Submit_bbutt from "@/components/ui/SubmitBtn";

export default function Uploadblueprints({ fun }: any) {
  const [email, setemail] = useState("");
  const [correct, setcorrect] = useState(false);

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
          <Submit_bbutt text="Uploaad from File " />
          {/* Camera Button */}
          <Submit_bbutt text="Upload from camara" />


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

          <Submit_bbutt text="Upload Attachment" />

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
