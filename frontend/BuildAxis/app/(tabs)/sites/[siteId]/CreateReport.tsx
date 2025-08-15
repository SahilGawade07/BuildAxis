import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Define types for Calendar props
type CalendarProps = {
  selectedDate: number; // day number selected
  onDateSelect: (day: number) => void;
  visible: boolean;
};

// Calendar component with typed props
const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, visible }) => {
  if (!visible) return null;

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const currentMonth = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: { day: number; isCurrentMonth: boolean; isNextMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isNextMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isNextMonth: false,
    });
  }

  const remainingCells = 42 - calendarDays.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isNextMonth: true,
    });
  }

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {calendarDays.slice(0, 35).map((dateObj, index) => {
          const isSelected = selectedDate === dateObj.day && dateObj.isCurrentMonth;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDay,
                !dateObj.isCurrentMonth && styles.inactiveDay,
              ]}
              onPress={() => dateObj.isCurrentMonth && onDateSelect(dateObj.day)}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  !dateObj.isCurrentMonth && styles.inactiveDayText,
                ]}
              >
                {dateObj.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Define props for ReportModal
type ReportModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ReportModal: React.FC<ReportModalProps> = ({ visible, onClose }) => {
  const [title, setTitle] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("12-12-2022");
  const [toDate, setToDate] = useState<string>("12-12-2022");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<number>(24);
  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);

  const handleDateSelect = (day: number) => {
    const formattedDate = `${day}-12-2022`;
    if (activeInput === "from") {
      setFromDate(formattedDate);
    } else if (activeInput === "to") {
      setToDate(formattedDate);
    }
    setSelectedDate(day);
    setShowCalendar(false); 
  };

  const openDatePicker = (inputType: "from" | "to") => {
    setActiveInput(inputType);
    setShowCalendar(true);
  };

  const handleGenerateReport = () => {
    console.log("Generating report:", { title, fromDate, toDate });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.dateRow}>
              <View style={styles.dateGroup}>
                <Text style={styles.label}>From</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => openDatePicker("from")}
                >
                  <Text style={styles.dateText}>{fromDate}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.dateGroup}>
                <Text style={styles.label}>To</Text>
                <TouchableOpacity style={styles.dateInput} onPress={() => openDatePicker("to")}>
                  <Text style={styles.dateText}>{toDate}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReport}>
              <Text style={styles.generateButtonText}>Generate Report</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            visible={showCalendar}
          />

          {/* Calendar Background */}
          {showCalendar && (
            <TouchableOpacity
              style={styles.calendarBackground}
              onPress={() => setShowCalendar(false)}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  dateGroup: {
    flex: 0.48,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#0247D3",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dayHeader: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
    flex: 1,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  selectedDay: {
    backgroundColor: "#4A90E2",
    borderRadius: 6,
  },
  inactiveDay: {
    // Styling for previous/next month days
  },
  dayText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  inactiveDayText: {
    color: "#CCC",
  },
  calendarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
});
