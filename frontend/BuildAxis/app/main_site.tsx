import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { CompanyBar } from "@/Components/reusable";
import { Safe_area } from "@/Components/Common/safe_area";
import Back_Text_Butt from "@/Components/Common/back_butt";
import Add_items from "@/Components/Common/add_item";
import Upload_img from "@/Components/Common/upload_images";
import Submit_bbutt from "@/Components/Common/Submit_butt";
import { Ionicons } from "@expo/vector-icons";

export default function main_site() {
const [active, setActive] = useState("Assign Task");

const menuItems = ["Assign Task", "Report", "Attendance", "Labour","Material","Expencess"];

return (
<SafeAreaView style={styles.container}>
<Safe_area />
<CompanyBar />
<Back_Text_Butt path="/tabs/Sites/Site" text="Site Name" />
<View style={{ height: 300, padding: 5 ,alignItems:"center"}}>
  <Image
    source={require("@/assets/images/Construction.png")}
    style={{ width: 450, height: "100%",}}
  />
</View>

<View style={{flexDirection:"row"}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActive(item)}
            style={styles.menuItem}
          >
            <Text
              style={[
                styles.text,
                active === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
              <TouchableOpacity style={styles.arrowBtn}>
          <Ionicons name="chevron-forward" size={18} color="#000" />
        </TouchableOpacity>
      </View>

</SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  text: {
    fontSize: 18,
    color: "gray",
  },
  activeText: {
    color: "#1976D2",
    textDecorationLine: "underline",
    textDecorationColor: "#1976D2",
    fontWeight: "500",
  },
  arrowBtn: {
    paddingHorizontal: 6,
    justifyContent: "center",
  },
});


