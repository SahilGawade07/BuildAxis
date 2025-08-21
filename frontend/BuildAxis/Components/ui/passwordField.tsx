import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string; // ✅ added label support
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChangeText,
  placeholder = "Enter your password",
  label = "Password",
}) => {
  const { theme } = useTheme();
  const [secure, setSecure] = useState(true);

  return (
    <>
      <Text style={[styles.name, { color: theme.text }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: theme.listItemBorder || "#ccc",
            backgroundColor: theme.listItemFill || theme.background,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.text || "#999"}
          secureTextEntry={secure}
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off" : "eye"}
            size={22}
            color={theme.text}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 1,
    height: 50,
    paddingRight: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  name: {
    fontSize: 16,
    marginBottom: 3,
    marginTop: 16,
    fontWeight: "600",
  },
});

export default PasswordField;
