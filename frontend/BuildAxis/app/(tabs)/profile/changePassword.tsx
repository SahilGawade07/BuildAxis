import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

// ⬅️ Replace this with your real API call
async function updatePasswordRequest({
  currentPassword,
  newPassword,
  confirmPassword,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  // Mock API delay
  return new Promise<{ success: boolean; message?: string }>((resolve) =>
    setTimeout(() => {
      if (currentPassword === "123456") {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "Invalid current password" });
      }
    }, 1200)
  );
}

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.passwordBox}>
        <Text style={styles.passwordTitle}>Change Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Current password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="New password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#888"
        />

        {passwordMessage ? (
          <Text style={styles.passwordMessage}>{passwordMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.updateBtn, isUpdatingPassword && { opacity: 0.6 }]}
          disabled={isUpdatingPassword}
          onPress={async () => {
            try {
              setIsUpdatingPassword(true);
              setPasswordMessage(null);

              if (!currentPassword || !newPassword || !confirmPassword) {
                setPasswordMessage("All fields are required");
                return;
              }
              if (newPassword !== confirmPassword) {
                setPasswordMessage("New password and confirm do not match");
                return;
              }

              const res = await updatePasswordRequest({
                currentPassword,
                newPassword,
                confirmPassword,
              });

              if (res?.success) {
                setPasswordMessage("✅ Password updated successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              } else {
                setPasswordMessage(res?.message || "Failed to update password");
              }
            } catch (error: any) {
              setPasswordMessage(error?.message || "Failed to update password");
            } finally {
              setIsUpdatingPassword(false);
            }
          }}
        >
          <Text style={styles.updateBtnText}>
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  passwordBox: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    elevation: 2,
  },
  passwordTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordMessage: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  updateBtn: {
    backgroundColor: "#0247D3",
    paddingVertical: 14,
    borderRadius: 8,
  },
  updateBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
