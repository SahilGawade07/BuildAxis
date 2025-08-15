import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";

//text input
export const TextInputs = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  textname,
}: any) => {
  return (
    <>
      <Text style={styles.name}>{textname}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginVertical: 1,
    height: 50,
  },
  name: {
    fontSize: 16,
    color: "#333",
    marginBottom: 3,
    marginTop: 16,
    fontWeight: "600",
  },
});

export default TextInputs;
