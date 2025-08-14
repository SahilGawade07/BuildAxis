// import { Safe_area } from "@/Components/Common/safeArea";
// import Colors from "@/Thems/color";
// import { FontAwesome6 } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//     Alert,
//     Image,
//     ImageBackground,
//     SafeAreaView,
//     ScrollView,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { TextInputs } from "../common/input_textbox";

// const ProfilePage = () => {
//   const router = useRouter();

//   const [orgName, setOrgName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");

//   const handleAddOrganization = () => {
//     if (!orgName || !email || !phone || !address) {
//       Alert.alert("Error", "Please fill all fields");
//       return;
//     }

//     Alert.alert("Success", "Organization added successfully!");
//     router.push("/tabs/Profile/profile");
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

//         <ScrollView>
//           <View>
//             {/* Top colored strip */}
//             <Safe_area />

//             {/* Header */}
//             <View style={styles.headerWrapper}>
//               <ImageBackground
//                 source={require("@/assets/images/Construction.png")}
//                 style={styles.headerImage}
//               >
//                 <View style={styles.logoWrapper}>
//                   <Image
//                     source={require("@/assets/images/logo.jpg")}
//                     style={styles.logo}
//                   />
//                   <View style={styles.plusIcon}>
//                     <FontAwesome6 name="add" size={15} color="black" />
//                   </View>
//                 </View>
//               </ImageBackground>
//             </View>

//             {/* Form */}
//             <View style={[styles.formSection, { marginTop: 70 }]}>
//               <TextInputs
//                 value={orgName}
//                 onChangeText={setOrgName}
//                 placeholder="Enter The Organization Name"
//                 keyboardType="default"
//                 textname="Organization Name"
//               />
//               <TextInputs
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Enter the Email"
//                 keyboardType="email-address"
//                 textname="Email"
//               />
//               <TextInputs
//                 value={phone}
//                 onChangeText={setPhone}
//                 placeholder="Enter the Phone Number"
//                 keyboardType="phone-pad"
//                 textname="Phone No."
//               />
//               <TextInputs
//                 value={address}
//                 onChangeText={setAddress}
//                 placeholder="Enter the Address"
//                 keyboardType="default"
//                 textname="Address"
//               />
//             </View>

//             {/* Buttons */}
//             <TouchableOpacity
//               style={styles.button}
//               onPress={handleAddOrganization}
//             >
//               <Text style={styles.buttonText}>Add to Organization</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.button, { width: "20%", alignSelf: "flex-end" }]}
//               onPress={() => router.push("/tabs/Profile/profile")}
//             >
//               <Text style={styles.buttonText}>Skip</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#6366f1",
//   },
//   headerWrapper: {
//     height: 250,
//     borderBottomRightRadius: 30,
//     borderBottomLeftRadius: 30,
//     overflow: "hidden",
//   },
//   headerImage: {
//     width: "100%",
//     height: "100%",
//   },
//   logoWrapper: {
//     backgroundColor: "#fff",
//     borderRadius: 50,
//     padding: 4,
//     position: "absolute",
//     bottom: -60,
//     left: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 6,
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 4, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     borderRadius: 60,
//     resizeMode: "contain",
//   },
//   plusIcon: {
//     position: "absolute",
//     bottom: 1,
//     right: 1,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     height: 30,
//     width: 30,
//     borderWidth: 2,
//     borderColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   formSection: {
//     padding: 15,
//   },
//   button: {
//     backgroundColor: "#0057FF",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     margin: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default ProfilePage;
