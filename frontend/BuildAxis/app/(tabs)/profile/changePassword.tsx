import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HeaderBar from "@/components/ui/headerBar";
import { SafeAreaView } from "react-native-safe-area-context";
import PasswordField from "@/components/ui/passwordField";
import PrimaryBtn from "@/components/ui/primaryBtn";
import { updatePasswordRequest } from "@/lib/api";

// Simple password strength checker
const getPasswordStrength = (password: string) => {
  if (password.length === 0) return { strength: 0, color: "#e0e0e0" };
  if (password.length < 6) return { strength: 1, color: "#ff6b6b" };
  if (password.length < 8) return { strength: 2, color: "#ffd93d" };
  return { strength: 3, color: "#6bcf7f" };
};

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  const handleUpdatePassword = async () => {
    try {
      setIsUpdatingPassword(true);
      setPasswordMessage(null);

      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordMessage("⚠️ All fields are required");
        return;
      }

      if (newPassword.length < 6) {
        setPasswordMessage("⚠️ Password must be at least 6 characters");
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordMessage("⚠️ New password and confirm do not match");
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
        setPasswordMessage(res?.message || "❌ Failed to update password");
      }
    } catch (error: any) {
      setPasswordMessage(error?.message || "❌ Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar title="Change Password" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>
          <Text style={styles.title}>Update Your Password</Text>
          <Text style={styles.subtitle}>
            Keep your account secure by updating your password regularly.
          </Text>
        </View>

        <View style={styles.card}>
          {/* Current Password */}
          <PasswordField
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            label="Current Password"
          />

          {/* New Password */}
          <View style={styles.passwordSection}>
            <PasswordField
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              label="New Password"
            />
            {newPassword.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : "#e0e0e0",
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.strengthText}>
                  {passwordStrength.strength === 1 && "Weak"}
                  {passwordStrength.strength === 2 && "Good"}
                  {passwordStrength.strength === 3 && "Strong"}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.confirmSection}>
            <PasswordField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter new password"
              label="Confirm Password"
            />

            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={styles.errorText}>❌ Passwords do not match</Text>
            )}
            {confirmPassword.length > 0 &&
              newPassword === confirmPassword &&
              newPassword.length > 0 && (
                <Text style={styles.successText}>✅ Passwords match</Text>
              )}
          </View>

          {/* Message */}
          {passwordMessage && (
            <View style={styles.messageContainer}>
              <Text
                style={[
                  styles.passwordMessage,
                  passwordMessage.includes("✅")
                    ? styles.successMessage
                    : styles.errorMessage,
                ]}
              >
                {passwordMessage}
              </Text>
            </View>
          )}

          {/* Update button */}
          <PrimaryBtn
            text={isUpdatingPassword ? "Updating..." : "Update Password"}
            onPress={handleUpdatePassword}
          />

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 Password Tips:</Text>
            <Text style={styles.tipText}>• Use at least 8 characters</Text>
            <Text style={styles.tipText}>• Mix letters, numbers & symbols</Text>
            <Text style={styles.tipText}>• Avoid personal information</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e8f2ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  passwordSection: {
    marginBottom: 4,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  confirmSection: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#ff4757",
    marginTop: 6,
    fontWeight: "500",
  },
  successText: {
    fontSize: 12,
    color: "#2ed573",
    marginTop: 6,
    fontWeight: "500",
  },
  messageContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  passwordMessage: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  errorMessage: {
    color: "#ff4757",
  },
  successMessage: {
    color: "#2ed573",
  },
  tipsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    lineHeight: 18,
  },
});
