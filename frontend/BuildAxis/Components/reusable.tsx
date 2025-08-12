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



//This is 4 grid box
export  function Overview ({ backgroundColor,circle_color,Ionicons_name,Ionicons_color,Text1,text2,text3}:any) {
    return(
         <>
<View style={[styles.card, { backgroundColor: backgroundColor }]}>
          <View style={[styles.circle,, { backgroundColor: circle_color }]}>
            <Ionicons name={Ionicons_name} size={60} color= {Ionicons_color}/>

          </View>
          <Text style={styles.cardTitle}>{Text1}</Text>
          <Text>{text2}</Text>
          <Text>{text3}</Text>
        </View>
         </>
    )
}


// C:\Users\Shraddha Sawant\OneDrive\Desktop\internship\BuildAxis\frontend\BuildAxis\Components\reusable.tsx
export function ReportCard({ type, name, dateRange }: any) {
  return (
    <>
      <View style={[styles.card, { backgroundColor: Colors.lightGray }]}>
        <View style={[styles.circle, { backgroundColor: Colors.blue }]}>
          <Ionicons name="document-text" size={60} color={Colors.white} />
        </View>
        <Text style={styles.cardTitle}>{type}</Text>
        <Text>{name}</Text>
        <Text>{dateRange}</Text>
      </View>
    </>
  );
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
   card: {
    width: "47%",
    height:200,
    padding: 15,
    marginBottom: 25,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems:"center"
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 8,
  },
  circle:{
    width:80,
    height:80,
    borderRadius:50,
    backgroundColor:"#B6DEFF",
    justifyContent:"center",
    alignItems:"center"
  }
 
});

