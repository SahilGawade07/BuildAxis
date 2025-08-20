import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import Topbar from "@/components/Sites/popupScreens/common/topBar";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function Reportui({ fun }: any) {
  const { theme } = useTheme();
  const { width } = Dimensions.get("window");

  const [title, setTitle] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeInput, setActiveInput] = useState<"from" | "to" | null>(null);

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString("en-GB") : "Select Date";

  const handleDateSelect = (date: Date) => {
    if (activeInput === "from") setFromDate(date);
    else if (activeInput === "to") setToDate(date);
    setShowCalendar(false);
  };

  const handleGenerateReport = () => {
    fun({ title, fromDate, toDate });
  };

  // Calendar Component
  const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Generate days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays: { day: number; isCurrentMonth: boolean }[] = [];

    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ day: i, isCurrentMonth: true });
    }

    // Next month days
    let nextDay = 1;
    while (calendarDays.length < 42) {
      calendarDays.push({ day: nextDay++, isCurrentMonth: false });
    }

    const goPrevMonth = () =>
      setCurrentMonth(new Date(year, month - 1, 1));
    const goNextMonth = () =>
      setCurrentMonth(new Date(year, month + 1, 1));

    const isSelected = (day: number) => {
      const selected = activeInput === "from" ? fromDate : toDate;
      return (
        selected &&
        selected.getDate() === day &&
        selected.getMonth() === month &&
        selected.getFullYear() === year
      );
    };

    return (
      <View style={styles.calendarContainer}>
        {/* Month Header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={goPrevMonth}>
            <Text>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth.toLocaleString("default", { month: "long" })} {year}
          </Text>
          <TouchableOpacity onPress={goNextMonth}>
            <Text>{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* Days of week */}
        <View style={styles.calendarHeader}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <Text style={styles.dayHeader} key={d}>
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((d, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayCell,
                isSelected(d.day) && styles.selectedDay,
              ]}
              onPress={() =>
                d.isCurrentMonth &&
                handleDateSelect(new Date(year, month, d.day))
              }
            >
              <Text
                style={[
                  styles.dayText,
                  !d.isCurrentMonth && styles.inactiveDayText,
                  isSelected(d.day) && styles.selectedDayText,
                ]}
              >
                {d.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setShowCalendar(false)}
          style={styles.closeCalendar}
        >
          <Text style={{ color: "#0247D3" }}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.modal, { backgroundColor: theme.listItemFill }]}>
      <Topbar text="Generate Report" funs={() => fun(null)} />

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
              onPress={() => {
                setActiveInput("from");
                setShowCalendar(true);
              }}
            >
              <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateGroup}>
            <Text style={styles.label}>To</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => {
                setActiveInput("to");
                setShowCalendar(true);
              }}
            >
              <Text style={styles.dateText}>{formatDate(toDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateReport}
        >
          <Text style={styles.generateButtonText}>Generate Report</Text>
        </TouchableOpacity>
      </View>

      {showCalendar && <Calendar />}
    </View>
  );
}

const styles = StyleSheet.create({
  modal: { borderRadius: 10, padding: 10, width: "95%", alignSelf: "center" },
  formContainer: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6, color: "#333" },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  dateRow: { flexDirection: "row", justifyContent: "space-between" },
  dateGroup: { flex: 0.48 },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: { fontSize: 15, color: "#333" },
  generateButton: {
    backgroundColor: "#0247D3",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
  },
  generateButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  calendarContainer: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  monthText: { fontSize: 16, fontWeight: "600", color: "#0247D3" },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  dayHeader: { flex: 1, textAlign: "center", fontWeight: "500", color: "#666" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  selectedDay: { backgroundColor: "#0247D3", borderRadius: 6 },
  dayText: { fontSize: 14, color: "#333" },
  selectedDayText: { color: "#fff", fontWeight: "600" },
  inactiveDayText: { color: "#bbb" },
  closeCalendar: { marginTop: 10, alignSelf: "center", padding: 8 },
});
