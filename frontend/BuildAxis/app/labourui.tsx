// import React from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     TouchableOpacity,
//     Image,
//     SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// type Person = {
//     id: string;
//     name: string;
//     subtitle: string;
//     image?: string;
// };

// const people: Person[] = [
//     { id: "1", name: "Shraddha Sawant", subtitle: "Supervisor" },
//     { id: "2", name: "Sahil Gawade", subtitle: "Supervisor" },
//     { id: "3", name: "Siddharth Chemate", subtitle: "Supervisor" },
//     { id: "4", name: "Riya Patil", subtitle: "Labour" },
//     { id: "5", name: "Soham Patil", subtitle: "Labour" },
//     { id: "6", name: "kunal Darade", subtitle: "Labour" },
// ];

// export default function PeopleList() {
//     const renderItem = ({ item }: { item: Person }) => (
//         <TouchableOpacity style={styles.card} activeOpacity={0.8}>
//             {/* Avatar */}
//             <View style={styles.avatarContainer}>
//                 {item.image ? (
//                     <Image source={{ uri: item.image }} style={styles.avatar} />
//                 ) : (
//                     <View style={styles.avatarPlaceholder}>
//                         <Ionicons name="person" size={20} color="#fff" />
//                     </View>
//                 )}
//             </View>

//             {/* Text Content */}
//             <View style={styles.textContainer}>
//                 <Text style={styles.name}>{item.name}</Text>
//                 <Text style={styles.subtitle}>{item.subtitle}</Text>
//             </View>

//             {/* Right-side icon */}
//             {/* <Ionicons name="chevron-forward" size={20} color="#999" /> */}
//         </TouchableOpacity>
//     );

//     return (
//         <SafeAreaView style={styles.container}>
//             <FlatList
//                 data={people}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//                 contentContainerStyle={{ padding: 16 }}
//                 showsVerticalScrollIndicator={false}
//             />
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#F5F6FA",
//     },
//     card: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 14,
//         marginBottom: 12,
//         backgroundColor: "#fff",
//         borderRadius: 12,
//         shadowColor: "#000",
//         shadowOpacity: 0.08,
//         shadowRadius: 6,
//         shadowOffset: { width: 0, height: 3 },
//         elevation: 2,
//     },
//     avatarContainer: {
//         marginRight: 14,
//     },
//     avatarPlaceholder: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: "#4A90E2",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     avatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//     },
//     textContainer: {
//         flex: 1,
//     },
//     name: {
//         fontSize: 15,
//         fontWeight: "600",
//         color: "#222",
//     },
//     subtitle: {
//         fontSize: 13,
//         color: "#666",
//         marginTop: 2,
//     },
// });

import { useFocusEffect } from "@react-navigation/native";


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchLaboursBySite, getLabours } from "@/lib/api"; // ✅ adjust import path
import { Labour } from "@/types/labour"

// 👷 Component
const PeopleList = ({ siteId }: { siteId: string }) => {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await fetchLaboursBySite(siteId);
  //       setLabours(res.data)
  //     } catch (err) {
  //       console.error("Error fetching labours:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);


  const loadLabours = async () => {
    setLoading(true);
    try {
      const res = await fetchLaboursBySite(siteId);
      setLabours(res.data);
    } catch (err) {
      console.error("Error fetching labours:", err);
    } finally {
      setLoading(false);
    }
  };

useFocusEffect(
  React.useCallback(() => {
    loadLabours();
  }, [siteId])
); // 👈 will run again after refreshKey changes


  const renderItem = ({ item }: { item: Labour }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {item.profilePic ? (
          <Image source={{ uri: item.profilePic }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        )}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.name}>
          {item.fName} {item.lName}
        </Text>
        <Text style={styles.subtitle}>{item.work || "Labour"}</Text>
      </View>
    </TouchableOpacity>
  );

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
      <FlatList
        data={labours}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No labours found</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
export default PeopleList;
