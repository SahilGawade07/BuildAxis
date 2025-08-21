import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const slides = [
  {
    id: 1,
    image: require("@/assets/images/SlideA.jpg"),
    title: "Manage Projects Efficiently",
    subtitle:
      "Keep track of all your construction projects in one place with real-time updates.",
  },
  {
    id: 2,
    image: require("@/assets/images/SlideB.jpg"),
    title: "Monitor Workforce & Resources",
    subtitle:
      "Assign tasks, track workers, and manage materials to avoid delays and overspending.",
  },
  {
    id: 3,
    image: require("@/assets/images/SlideC.jpg"),
    title: "Simplify Reporting & Communication",
    subtitle:
      "Generate reports, share progress, and communicate seamlessly with your team.",
  },
];

export default function Index() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
        "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/(auth)/login");
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const { image, title, subtitle } = slides[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="cover" />

      <Animated.View
        style={styles.bottomContainer}
        entering={FadeInUp.duration(500)}
        key={currentSlide}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentSlide === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.buttonRow}>
          {currentSlide > 0 && (
            <TouchableOpacity onPress={handleBack}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentSlide === slides.length - 1 ? "Getting Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "65%",
  },
  bottomContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#555",
    marginBottom: 25,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backText: {
    fontSize: 14,
    color: "#888",
    fontFamily: "Inter-Regular",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 25,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Inter-Bold",
    fontSize: 14,
  },
});
