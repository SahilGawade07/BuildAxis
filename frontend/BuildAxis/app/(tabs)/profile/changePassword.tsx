import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import HeaderBar from "@/components/ui/headerBar";
import { SafeAreaView } from "react-native-safe-area-context";
import PasswordField from "@/components/ui/passwordField";
import PrimaryBtn from "@/components/ui/primaryBtn";
import { updatePasswordRequest } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

// Simple password strength checker
const getPasswordStrength = (password: string) => {
  if (password.length === 0) return { strength: 0, color: "#e0e0e0" };
  if (password.length < 6) return { strength: 1, color: "#ff6b6b" };
  if (password.length < 8) return { strength: 2, color: "#ffd93d" };
  return { strength: 3, color: "#6bcf7f" };
};

export default function ChangePasswordPage() {
  const { theme } = useTheme();
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Change Password" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.isDark ? theme.card : "#e8f2ff" },
            ]}
          >
            <Text style={styles.icon}>🔐</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            Update Your Password
          </Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Keep your account secure by updating your password regularly.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
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
                              : theme.isDark
                              ? "#374151"
                              : "#e0e0e0",
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthText, { color: theme.muted }]}>
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
              <Text style={[styles.errorText, { color: theme.error }]}>
                ❌ Passwords do not match
              </Text>
            )}
            {confirmPassword.length > 0 &&
              newPassword === confirmPassword &&
              newPassword.length > 0 && (
                <Text style={[styles.successText, { color: theme.success }]}>
                  ✅ Passwords match
                </Text>
              )}
          </View>

          {/* Message */}
          {passwordMessage && (
            <View
              style={[
                styles.messageContainer,
                {
                  backgroundColor: theme.isDark
                    ? theme.listItemFill
                    : "#f8f9fa",
                },
              ]}
            >
              <Text
                style={[
                  styles.passwordMessage,
                  passwordMessage.includes("✅")
                    ? [styles.successMessage, { color: theme.success }]
                    : [styles.errorMessage, { color: theme.error }],
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
          <View
            style={[
              styles.tipsContainer,
              {
                backgroundColor: theme.isDark ? theme.listItemFill : "#f8f9fa",
              },
            ]}
          >
            <Text style={[styles.tipsTitle, { color: theme.text }]}>
              💡 Password Tips:
            </Text>
            <Text style={[styles.tipText, { color: theme.muted }]}>
              • Use at least 8 characters
            </Text>
            <Text style={[styles.tipText, { color: theme.muted }]}>
              • Mix letters, numbers & symbols
            </Text>
            <Text style={[styles.tipText, { color: theme.muted }]}>
              • Avoid personal information
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    elevation: 3,
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
  },
  confirmSection: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  successText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  messageContainer: {
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
    // Color applied inline
  },
  successMessage: {
    // Color applied inline
  },
  tipsContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 18,
  },
});
