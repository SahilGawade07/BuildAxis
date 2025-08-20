import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import Back_Text_Butt from "@/components/ui/backBtn";

const languages = [
  { id: "en-US", name: "English (US)", flag: "🇺🇸" },
  { id: "en-UK", name: "English (UK)", flag: "🇬🇧" },
  { id: "fr", name: "French", flag: "🇫🇷" },
  { id: "de", name: "German", flag: "🇩🇪" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
  { id: "hi", name: "Hindi", flag: "🇮🇳" },
  { id: "mr", name: "Marathi", flag: "🇮🇳" },
];

export default function SelectLanguage() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState("en-US");

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          alignItems: "flex-start",
          justifyContent: "flex-start",
        },
      ]}
    >
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.primary}
      />

      {/* Back button */}
      <View style={styles.topSection}>
        <Back_Text_Butt path="/tabs/Sites/Site" text="Languages" />
      </View>

      {/* Selected Language */}
      <Text style={[styles.title, { color: theme.text }]}>Selected Language</Text>
      <View
        style={[
          styles.selectedCard,
          { backgroundColor: theme.primary },
        ]}
      >
        <Text style={styles.selectedText}>
          {languages.find(l => l.id === selected)?.flag}{" "}
          {languages.find(l => l.id === selected)?.name}
        </Text>
      </View>

      {/* All Languages List */}
      <Text style={[styles.title, { color: theme.text }]}>All Languages</Text>
      <ScrollView style={styles.list}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.id}
            style={[
              styles.card,
              {
                borderColor: selected === lang.id ? theme.primary : theme.listItemBorder,
                backgroundColor: theme.listItemFill,
              },
            ]}
            onPress={() => setSelected(lang.id)}
          >
            <Text style={[styles.langText, { color: theme.text }]}>
              {lang.flag} {lang.name}
            </Text>
            {selected === lang.id && (
              <Text style={{ color: theme.text }}>✔</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: theme.primary }]}
        onPress={() => console.log("Saved Language:", selected)}
      >
        <Text style={styles.saveText}>Save Language</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  topSection: {
    width: "100%",
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  selectedCard: { padding: 15, borderRadius: 10, marginBottom: 20, width: "100%" },
  selectedText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  list: { flex: 1, width: "100%" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    width: "100%",
  },
  langText: { fontSize: 16 },
  saveBtn: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
