import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Topbar from "@/components/Sites/popupScreens/common/topBar";
import { TextInputs } from "@/components/ui/inputField";
export default function Uploadblueprints({ fun }: any) {
  const [email, setemail] = useState("");

  const [correct, setcorrect] = useState(true);

  return (
    <View style={[styles.modal]}>
      {/* Header */}
      <Topbar text="Upload Attachments" funs={fun} />

      {correct && (
        <View>
          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const update = !correct;
              setcorrect(update);
            }}
          >
            <Text style={styles.buttonText}>Choose from file</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const update = !correct;
              setcorrect(update);
            }}
          >
            <Text style={styles.buttonText}>Click From Camera</Text>
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
            i
          />
          <TextInputs
            value={email}
            onChangeText={setemail}
            placeholder="Item Name"
            keyboardType="email-address"
            textname="Item Name"
            i
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Upload Attachment</Text>
          </TouchableOpacity>
        </View>
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  close: {
    fontSize: 16,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  checkedRow: {
    backgroundColor: "#e0f7e9",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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
