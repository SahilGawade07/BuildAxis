import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, StyleSheet, FlatList ,TouchableOpacity,Button} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useRouter } from "expo-router";
const data = [
  { id: "1", name: "Shraddha Swant" },
  { id: "2", name: "Shraddha Swant" },
  { id: "3", name: "Shraddha Swant" },
  { id: "4", name: "Shraddha Swant" },
];
 const router = useRouter();

export default function LabourList({ item }:any) {

  return (
 <View>
      <View style={styles.row}>
          <View style={styles.imageBox}>
            <Ionicons name="image-outline" size={28} color="#888" />
          </View>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.separator} />
         
        
        
         </View>
       
 
   

  );
}

const styles = StyleSheet.create({

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
  },
    imageBox: {
    width: 50,
    height: 50,
    backgroundColor: "#EAEFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  addButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 20,
  backgroundColor: "#3B82F6",
  paddingVertical: 12,
  borderRadius: 8,
},
addButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "500",
  marginLeft: 5,
},

});