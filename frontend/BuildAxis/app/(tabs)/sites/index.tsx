import { CompanyBar } from "@/components/ui/companyBar";
import { SiteBox } from "@/components/Sites/siteBox";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import { getSites } from "@/lib/api";
import { Sites } from "@/types/sites";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Site() {
  const router = useRouter();
  const { theme } = useTheme();




  const [sites, setSites] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

useEffect(() => {
  async function fetchSites() {
    try {
      const storedInfo = await AsyncStorage.getItem("organizationInfo");

      if (!storedInfo) {
        console.log("No organization info found in storage");
        return;
      }

      const parsed = JSON.parse(storedInfo);

      if (!parsed?.orgId) {
        console.log("No orgId found in parsed data");
        return;
      }

      const id = parsed.orgId;
      console.log("OrgId:", id);

      const data = await getSites(id);
      setSites(data);

      console.log("✅ Data fetched successfully");
      console.log(data);

    } catch (err: any) {
      console.error("❌ Fetch sites error:", err.message);
      setError(err.message);
    }
  }

  fetchSites();
}, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundgrey }]}>
      <StatusBar backgroundColor={theme.primary} barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <CompanyBar />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Projects</Text>

      <View
        style={[
          styles.searchContainer,
          {
            // backgroundColor: theme.listItemFill,
            // borderColor: theme.listItemBorder,
            backgroundColor:theme.listItemFill,
             borderColor: theme.listItemBorder,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={theme.icons}
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search"
          style={[styles.searchInput, { color: theme.text }]}
          placeholderTextColor={theme.icons}
        />
      </View>

      <FlatList
        data={sites}
        renderItem={({ item }) => <SiteBox item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.secondary }]}
        onPress={() => router.push("/sites/addSite")}
      >
        <FontAwesome6 name="add" size={20} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginHorizontal: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 27,
    borderWidth: 1,
    paddingVertical:2
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  fab: {
    height: 50,
    width: 50,
    borderRadius: 25,
    position: "absolute",
    right: 20,
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
