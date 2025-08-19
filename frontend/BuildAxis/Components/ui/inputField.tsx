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
            borderColor: theme.listItemBorder || "#ccc",
            color: theme.text,
            backgroundColor: theme.listItemFill || theme.background,
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
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginVertical: 1,
    height: 50,
    fontSize: 16,
  },
  name: {
    fontSize: 16,
    marginBottom: 3,
    marginTop: 16,
    fontWeight: "600",
  },
});

export default TextInputs;
