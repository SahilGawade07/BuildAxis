import React from "react";
import { Text, TextInput, StyleSheet, KeyboardTypeOptions } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface TextInputsProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  textname: string;
  icon?: string; // Included from LoginScreen.tsx usage
}

const TextInputs: React.FC<TextInputsProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  textname,
  icon, // Not used in rendering but included for compatibility
}) => {
  const { theme } = useTheme();

  return (
    <>
      <Text style={[styles.name, { color: theme.text }]}>{textname}</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.inputbordercolor,
            color: theme.inputcolor,
            backgroundColor: theme.inputbackgroundcolor,
          },
        ]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.text || "#999"} // ✅ moved here
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    // borderWidth: 1,

    // borderRadius: 10,
    // marginVertical: 1,
    // height: 50,

   
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 18,
 


  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    marginBottom: 6,
  },
});

export default TextInputs;
