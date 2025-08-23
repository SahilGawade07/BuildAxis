import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { Colors } from "@/Thems/color";
import AsyncStorage from "@react-native-async-storage/async-storage";


export function CompanyBar() {
  const [user, setUser] = useState<{ name: string; logoUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const storedData = await AsyncStorage.getItem("userInfo");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUser(parsedData.org);

          // console.log("Org Name:", parsedData.org.name);
          // console.log("Org Logo:", parsedData.org.logoUrl);
        }
      } catch (err) {
        console.error("Error loading user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  
  if (loading || !user) return null;

  return (
    <View style={styles.header}>
      
        <Image source={{ uri: user.logoUrl }} style={styles.logo} />
      
      <Text style={styles.headerText}>{user.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
   
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 8,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#ffffff"
  },
});
