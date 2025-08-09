import React from "react";
import {
  View,Text,Image,StyleSheet,TouchableOpacity,StatusBar,
} from "react-native";
import Colors from "@/Thems/color";
import Fonts from "@/Thems/font";
import { Ionicons } from "@expo/vector-icons";

//This is top company Bar
export function CompanyBar() {
    return(
         <>
              <View style={styles.header}>
                <Image
                  source={require("@/assets/images/logo.jpg")}
                  style={styles.logo}
                />
                <Text style={styles.headerText}>JMD Constructions</Text>
              </View>

         </>
    )
}

const styles = StyleSheet.create({

  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,

    justifyContent: "space-between",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius:5,
    
  },
  headerText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "500",
    flex: 1,
    marginLeft: 12,
  },


 
});