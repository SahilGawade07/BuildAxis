import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLabours } from "@/lib/api";
import { Labour } from "@/types/labour";
import { addLaboursToSite } from "@/lib/api";
import HeaderBar from "@/components/ui/headerBar";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LabourSelectionPage({ orgId }: { orgId: string }) {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {  siteName } = useLocalSearchParams<{ siteId:string; siteName: string }>();
  const { siteId } = useLocalSearchParams<{ siteId: string }>();


  useEffect(() => {
    (async () => {
        console.log("siteId122:", siteId);
      try {
        const data = await getLabours("688c88be363b135f8911086f");
        setLabours(data);
      } catch (err) {
        console.error("Error fetching labours:", err);
      } finally {
        setLoading(false);
      }
    })();

  }, []);

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddToSite = async () => {
    if (selected.length === 0) return; // button disabled anyway

    setSubmitting(true);
    try {
      await addLaboursToSite(siteId, selected);
      alert(`Added ${selected.length} labours to site ✅`);
      setSelected([]);
    } catch (err) {
      console.error("Error adding labours:", err);
      alert("Failed to add labours");
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: Labour }) => {
    const isSelected = selected.includes(item._id);
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        activeOpacity={0.8}
        onPress={() => toggleSelect(item._id)}
      >
        <View style={styles.avatarContainer}>
          {item.profilePic ? (
            <Image source={{ uri: item.profilePic }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.fName} {item.lName}</Text>
          <Text style={styles.subtitle}>{item.work || "Labour"}</Text>
        </View>

        <Ionicons
          name={isSelected ? "checkbox" : "square-outline"}
          size={22}
          color={isSelected ? "#4A90E2" : "#aaa"}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Loading labours...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="Add Labours to Site" />
      
      <FlatList
        data={labours}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[
          styles.button,
          submitting && { opacity: 0.6 },
          selected.length === 0 && { backgroundColor: "#ccc" }
        ]}
        onPress={handleAddToSite}
        disabled={submitting || selected.length === 0}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Adding..." : `Add to Site (${selected.length})`}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  card: { flexDirection: "row", alignItems: "center", padding: 14, marginBottom: 12, backgroundColor: "#fff", borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  cardSelected: { borderWidth: 1.5, borderColor: "#4A90E2" },
  avatarContainer: { marginRight: 14 },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#4A90E2", justifyContent: "center", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  textContainer: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: "#222" },
  subtitle: { fontSize: 13, color: "#666", marginTop: 2 },
  button: { position: "absolute", bottom: 20, left: 20, right: 20, paddingVertical: 14, backgroundColor: "#4A90E2", borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
