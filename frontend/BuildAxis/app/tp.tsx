import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import GestureRecognizer from "react-native-swipe-gestures";
import TopTabs from "@/components/Sites/tasks";
import AttendancaceBox from "@/components/ui/attandanceBox";
import CircularProgress from "@/components/Sites/tasks/common/circleprgressbar";
import HeaderBar from "@/components/ui/headerBar";

const HEADER_MAX_HEIGHT = 350;
const HEADER_MIN_HEIGHT = 0;

// Enhanced Bar Chart Component
const AnimatedBarChart = ({ data, height = 120 }) => {
  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedValues.map((animValue, index) =>
      Animated.timing(animValue, {
        toValue: data[index].value,
        duration: 800 + index * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );
    Animated.stagger(80, animations).start();
  }, [data]);

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Weekly Progress</Text>
      <View style={styles.barChartContainer}>
        {data.map((item, index) => {
          const barHeight = animatedValues[index].interpolate({
            inputRange: [0, maxValue],
            outputRange: [0, height],
            extrapolate: 'clamp',
          });

          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barBackground}>
                <Animated.View
                  style={[
                    styles.animatedBar,
                    {
                      height: barHeight,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
              <Text style={styles.barValue}>{item.value}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Line Chart Component
const LineChart = ({ data, height = 100 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Task Completion Trend</Text>
      <View style={[styles.lineChartContainer, { height }]}>
        {data.map((point, index) => {
          const pointHeight = (point.value / 100) * (height - 20);
          const animatedHeight = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, pointHeight],
          });

          return (
            <View key={index} style={styles.linePoint}>
              <Animated.View
                style={[
                  styles.lineBar,
                  {
                    height: animatedHeight,
                    backgroundColor: `hsl(${120 - (point.value / 100) * 60}, 70%, 50%)`,
                  },
                ]}
              />
              <Text style={styles.lineLabel}>{point.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Donut Chart Component
const DonutChart = ({ data, size = 100 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Task Distribution</Text>
      <View style={styles.donutContainer}>
        <View style={[styles.donutChart, { width: size, height: size }]}>
          <View style={styles.donutCenter}>
            <Text style={styles.donutCenterText}>{total}%</Text>
            <Text style={styles.donutCenterLabel}>Total</Text>
          </View>
        </View>
        <View style={styles.donutLegend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.value}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default function TaskDetailsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;
  const [dropped, setdropped] = useState(false);
  const [selectedChart, setSelectedChart] = useState('bar');

  const members = [
    { id: 1, img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 3, img: "https://randomuser.me/api/portraits/men/85.jpg" },
    { id: 4, img: "https://randomuser.me/api/portraits/women/45.jpg" },
  ];

  // Chart data
  const barChartData = [
    { label: 'Mon', value: 85, color: '#FF6B6B' },
    { label: 'Tue', value: 92, color: '#4ECDC4' },
    { label: 'Wed', value: 78, color: '#45B7D1' },
    { label: 'Thu', value: 95, color: '#96CEB4' },
    { label: 'Fri', value: 88, color: '#FECA57' },
    { label: 'Sat', value: 72, color: '#FF9FF3' },
  ];

  const lineChartData = [
    { label: 'W1', value: 65 },
    { label: 'W2', value: 78 },
    { label: 'W3', value: 85 },
    { label: 'W4', value: 92 },
    { label: 'W5', value: 88 },
  ];

  const donutData = [
    { label: 'Completed', value: 65, color: '#2ECC71' },
    { label: 'In Progress', value: 25, color: '#F39C12' },
    { label: 'Pending', value: 10, color: '#E74C3C' },
  ];

  const scrollY = useRef(new Animated.Value(0)).current;

  // 🔹 Derived header animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerContentOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const headerContentTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -40],
    extrapolate: "clamp",
  });

  // 🔹 Smooth Swipe handling
  // 🔹 Derived content translation (instead of paddingTop jump)
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [HEADER_MAX_HEIGHT, 0], // header height to compacted height
    extrapolate: "clamp",
  });

  // 🔹 Smooth Swipe handling
  const handleSwipeUp = () => {
    setdropped(true);
    Animated.spring(scrollY, {
      toValue: 100, // collapse
      useNativeDriver: false,
      speed: 6,
      bounciness: 4,
    }).start();
  };

  const handleSwipeDown = () => {
    setdropped(false);
    Animated.spring(scrollY, {
      toValue: 0, // expand
      useNativeDriver: false,
      speed: 6,
      bounciness: 4,
    }).start();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#F8F9FA" }]}>
      <StatusBar
        backgroundColor="#3498DB"
        barStyle="light-content"
      />
      <HeaderBar title="Task Name" />

      <View style={styles.headerSection}>
        {/* Progress + Members */}
        <View style={styles.progressRow}>
          <CircularProgress />
          <View style={styles.memberRow}>
            {members.map((m) => (
              <Image
                key={m.id}
                source={{ uri: m.img }}
                style={[styles.memberImg, { borderColor: "#fff" }]}
              />
            ))}
            <TouchableOpacity
              style={[
                styles.addMember,
                { borderColor: "#3498DB", backgroundColor: "#E8F4FD" },
              ]}
            >
              <Entypo name="plus" size={20} color="#3498DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards with Enhanced Colors */}
        <View style={styles.cardContainer}>
          <AttendancaceBox
            backgroundColor="#E8F5E8"
            circle_color="#4CAF50"
            Ionicons_name="people-outline"
            Ionicons_color="#2E7D32"
            Text1="Labours"
            text2="155"
          />
          <AttendancaceBox
            backgroundColor="#FFF3E0"
            circle_color="#FF9800"
            Ionicons_name="cash-outline"
            Ionicons_color="#F57C00"
            Text1="Expenses"
            text2="100"
          />
          <AttendancaceBox
            backgroundColor="#E3F2FD"
            circle_color="#2196F3"
            Ionicons_name="attach"
            Ionicons_color="#1976D2"
            Text1="Attachments"
            text2="155"
          />
        </View>
      </View>
      
      {/* Chart Selection Buttons */}
      <View style={styles.chartToggleContainer}>
        <TouchableOpacity
          style={[styles.chartToggle, selectedChart === 'bar' && styles.activeChartToggle]}
          onPress={() => setSelectedChart('bar')}
        >
          <Ionicons name="bar-chart" size={16} color={selectedChart === 'bar' ? '#fff' : '#666'} />
          <Text style={[styles.chartToggleText, selectedChart === 'bar' && styles.activeChartToggleText]}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chartToggle, selectedChart === 'line' && styles.activeChartToggle]}
          onPress={() => setSelectedChart('line')}
        >
          <Ionicons name="trending-up" size={16} color={selectedChart === 'line' ? '#fff' : '#666'} />
          <Text style={[styles.chartToggleText, selectedChart === 'line' && styles.activeChartToggleText]}>Trend</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chartToggle, selectedChart === 'donut' && styles.activeChartToggle]}
          onPress={() => setSelectedChart('donut')}
        >
          <Ionicons name="pie-chart" size={16} color={selectedChart === 'donut' ? '#fff' : '#666'} />
          <Text style={[styles.chartToggleText, selectedChart === 'donut' && styles.activeChartToggleText]}>Distribution</Text>
        </TouchableOpacity>
      </View>

      {/* Chart Display */}
      <View style={styles.singleChartContainer}>
        {selectedChart === 'bar' && <AnimatedBarChart data={barChartData} />}
        {selectedChart === 'line' && <LineChart data={lineChartData} />}
        {selectedChart === 'donut' && <DonutChart data={donutData} />}
      </View>
      
      <TopTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#F8F9FA"
  },

  headerSection: {
    backgroundColor: "#fff",
    marginBottom: 10,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  chartToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 20,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  chartToggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 17,
  },

  activeChartToggle: {
    backgroundColor: "#3498DB",
  },

  chartToggleText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },

  activeChartToggleText: {
    color: "#fff",
  },

  singleChartContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 15,
  },

  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
  },

  barColumn: {
    alignItems: "center",
    flex: 1,
  },

  barBackground: {
    width: 25,
    height: 120,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  animatedBar: {
    width: "100%",
    borderRadius: 12,
  },

  barLabel: {
    marginTop: 8,
    fontSize: 11,
    color: "#7F8C8D",
    fontWeight: "500",
  },

  barValue: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2C3E50",
  },

  lineChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },

  linePoint: {
    alignItems: "center",
    flex: 1,
  },

  lineBar: {
    width: 18,
    borderRadius: 9,
    marginBottom: 10,
  },

  lineLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    fontWeight: "500",
  },

  donutContainer: {
    alignItems: "center",
  },

  donutChart: {
    borderRadius: 50,
    backgroundColor: "#F8F9FA",
    marginBottom: 15,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  donutCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  donutCenterText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },

  donutCenterLabel: {
    fontSize: 10,
    color: "#7F8C8D",
  },

  donutLegend: {
    alignItems: "flex-start",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    width: "100%",
  },

  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  legendText: {
    flex: 1,
    fontSize: 12,
    color: "#2C3E50",
    fontWeight: "500",
  },

  legendValue: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "600",
  },

  // 🔹 Progress + Members Row
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#fff"
  },

  memberRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },

  memberImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: -12,
    borderWidth: 2,
    borderColor: "#fff",
  },

  addMember: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    backgroundColor: "#E8F4FD",
    borderColor: "#3498DB",
  },

  // 🔹 Cards Row with Enhanced Colors
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "#fff"
  },

  // 🔹 Header row (if you add custom title/subtitle later)
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  taskName: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginLeft: 5,
    color: "#2C3E50"
  },

  userName: { 
    fontSize: 16, 
    fontWeight: "500",
    color: "#34495E"
  },

  // 🔹 Header background (animated area if used later)
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
});