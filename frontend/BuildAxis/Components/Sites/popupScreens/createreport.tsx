import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTheme } from "@/context/ThemeContext";

const { width, height } = Dimensions.get("window");

type ReportModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ReportModal: React.FC<ReportModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const formatDate = (date: Date | null) => (date ? date.toLocaleDateString("en-GB") : "Select Date");

  const handleGenerateReport = () => {
    Alert.alert(
      "Report Generated ✅",
      `Title: ${title || "Untitled"}\nFrom: ${formatDate(fromDate)}\nTo: ${formatDate(toDate)}`
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView
        style={StyleSheet.absoluteFill}
        tint={theme.isDark ? "dark" : "light"}
        intensity={30}
      />
      <View style={styles.modalWrapper}>
        <View style={[styles.modalContainer, { backgroundColor: theme.listItemFill }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: theme.text }]}>Generate Report</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Title</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.listItemBorder, color: theme.text }]}
              placeholder="Enter report title"
              placeholderTextColor={theme.icons}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateGroup}>
              <Text style={[styles.label, { color: theme.text }]}>From</Text>
              <TouchableOpacity
                style={[styles.dateInput, { borderColor: theme.listItemBorder }]}
                onPress={() => Alert.alert("Pick From Date")} // replace with your date picker
              >
                <Text style={{ color: theme.text }}>{formatDate(fromDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color={theme.icons} />
              </TouchableOpacity>
            </View>

            <View style={styles.dateGroup}>
              <Text style={[styles.label, { color: theme.text }]}>To</Text>
              <TouchableOpacity
                style={[styles.dateInput, { borderColor: theme.listItemBorder }]}
                onPress={() => Alert.alert("Pick To Date")} // replace with your date picker
              >
                <Text style={{ color: theme.text }}>{formatDate(toDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color={theme.icons} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.secondary }]}
            onPress={handleGenerateReport}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Generate Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "95%",
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateGroup: {
    flex: 0.48,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
