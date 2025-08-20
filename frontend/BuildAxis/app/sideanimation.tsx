import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ Import router
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

const { width, height } = Dimensions.get("window");

// Calendar Component remains the same
type CalendarProps = {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  visible: boolean;
  onClose: () => void;
};

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  visible,
  onClose,
}) => {
  if (!visible) return null;

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: { day: number; isCurrentMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, isCurrentMonth: true });
  }

  let nextMonthDay = 1;
  while (calendarDays.length < 42) {
    calendarDays.push({ day: nextMonthDay++, isCurrentMonth: false });
  }

  const formatDate = (day: number) => new Date(year, month, day);

  const goToPrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={goToPrevMonth}>
          <Ionicons name="chevron-back" size={22} color="#0247D3" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Ionicons name="chevron-forward" size={22} color="#0247D3" />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarHeader}>
        {daysOfWeek.map((day, i) => (
          <Text key={i} style={styles.dayHeader}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarDays.map((dateObj, index) => {
          const isSelected =
            selectedDate &&
            dateObj.isCurrentMonth &&
            selectedDate.getDate() === dateObj.day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayCell, isSelected && styles.selectedDay]}
              onPress={() => dateObj.isCurrentMonth && onDateSelect(formatDate(dateObj.day))}
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

      <TouchableOpacity style={styles.closeCalendar} onPress={onClose}>
        <Text style={{ color: "#0247D3", fontWeight: "600" }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

// Report Modal with router back button
type ReportModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ReportModal: React.FC<ReportModalProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);

  const formatDate = (date: Date | null) => (date ? date.toLocaleDateString("en-GB") : "Select Date");

  const handleDateSelect = (date: Date) => {
    if (activeInput === "from") setFromDate(date);
    else if (activeInput === "to") setToDate(date);
    setShowCalendar(false);
  };

  const handleGenerateReport = () => {
    Alert.alert(
      "Report Generated ✅",
      `Title: ${title || "Untitled"}\nFrom: ${formatDate(fromDate)}\nTo: ${formatDate(toDate)}`
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>

            <Text style={styles.modalTitle}>Report</Text>
            <TouchableOpacity onPress={() => router.back()} style={{ paddingRight: 10 }}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.dateRow}>
              <View style={styles.dateGroup}>
                <Text style={styles.label}>From</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => { setActiveInput("from"); setShowCalendar(true); }}
                >
                  <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.dateGroup}>
                <Text style={styles.label}>To</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => { setActiveInput("to"); setShowCalendar(true); }}
                >
                  <Text style={styles.dateText}>{formatDate(toDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReport}>
              <Text style={styles.generateButtonText}>Generate Report</Text>
            </TouchableOpacity>
          </View>

          <Calendar
            selectedDate={activeInput === "from" ? fromDate : toDate}
            onDateSelect={handleDateSelect}
            visible={showCalendar}
            onClose={() => setShowCalendar(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ReportModal;


const styles = StyleSheet.create({
  modalOverlay:
  {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContainer:
  {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.9,
    paddingBottom: 10
  },
  modalHeader:
  {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  modalTitle:
  {
    fontSize: 18,
    fontWeight: "600",
    color: "#333"
  },
  closeButton:
  {
    padding: 4
  },
  formContainer:
  {
    padding: 20
  },
  inputGroup:
  {
    marginBottom: 20
  },
  label:
  {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333"
  },
  textInput:
  {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15
  },
  dateRow:
  {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dateGroup:
  {
    flex: 0.48
  },
  dateInput:
  {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  dateText:
  {
    fontSize: 15,
    color: "#333"
  },
  generateButton: 
  { backgroundColor: "#0247D3", 
    paddingVertical: 14, 
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25
  },
  generateButtonText: 
  { color: "#fff", 
    fontWeight: "600", 
    fontSize: 15 
  },
  calendarContainer:
   { margin: 20, 
    backgroundColor: "#fff", 
    borderRadius: 12,
    padding: 16, 
    elevation: 3 
  },
  monthHeader:
   { flexDirection: "row", 
     justifyContent: "space-between", 
     alignItems: "center", 
     marginBottom: 12 
  },
  monthText: 
  { fontSize: 16, 
    fontWeight: "600", 
    color: "#0247D3" 
  },
  calendarHeader: 
  { flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: "#eee", 
    paddingBottom: 6 
  },
  dayHeader: 
  { flex: 1, 
    textAlign: "center", 
    fontWeight: "500", 
    color: "#666" 
  },
  calendarGrid: 
  { flexDirection: "row", 
    flexWrap: "wrap" 
  },
  dayCell: 
  { width: "14.28%", 
    aspectRatio: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  selectedDay: 
  { backgroundColor: "#0247D3", 
    borderRadius: 6
  },
  dayText: 
  { fontSize: 14, 
    color: "#333" 
  },
  selectedDayText: 
  { color: "#fff", 
    fontWeight: "600" 
  },
  inactiveDayText: 
  { 
    color: "#bbb" 
  },
  closeCalendar: 
  { 
    marginTop: 10, 
    alignSelf: "center", 
    padding: 8 
  },
});
