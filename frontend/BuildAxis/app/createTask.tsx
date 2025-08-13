// import { Picker } from "@react-native-picker/picker";
// import React, { useState } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // Reusable components
// import Add_items from "@/Components/Common/add_item";
// import Back_Text_Butt from "@/Components/Common/backBtn";
// import { Safe_area } from "@/Components/Common/safeArea";
// import Submit_bbutt from "@/Components/Common/SubmitBtn";
// import Upload_img from "@/Components/Common/uploadImages";
// import { CompanyBar } from "@/Components/reusable";
// import { TextInputs } from "./Auth/common/input_textbox";

// export default function CreateTaskScreen() {
//   // State for dropdown
//   const [selectedSupervisor, setSelectedSupervisor] = useState("");
  
//   // State for form inputs
//   const [taskName, setTaskName] = useState("");
//   const [description, setDescription] = useState("");

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Custom Safe Area Styling */}
//       <Safe_area />

//       {/* Top Bar with Logo & Name */}
//       <CompanyBar />

//       {/* Back Button + Title */}
//       <Back_Text_Butt path="" text="Create Task" />

//       <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        
//         {/* Task Name Input */}
//         <TextInputs
//           value={taskName}
//           onChangeText={setTaskName}
//           placeholder="Task Name"
//           keyboardType="default"
//           textname="Task Name"
//         />

//         {/* Description Input */}
//         <TextInputs
//           value={description}
//           onChangeText={setDescription}
//           placeholder="Description"
//           keyboardType="default"
//           textname="Description"
//         />

//         {/* Assign Supervisor Dropdown */}
//         <Text style={styles.label}>Assign Supervisor</Text>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={selectedSupervisor}
//             onValueChange={(itemValue) => setSelectedSupervisor(itemValue)}
//           >
//             <Picker.Item label="Select" value="" />
//             <Picker.Item label="Supervisor 1" value="sup1" />
//             <Picker.Item label="Supervisor 2" value="sup2" />
//           </Picker>
//         </View>

//         {/* Upload Blueprint Section */}
//         <Upload_img />

//         {/* Add Labour */}
//         <Add_items path="add-labour" text="Add Labour" />

//         {/* Assign Supervisor Again (if multiple supervisors) */}
//         <Add_items path="assign-supervisor" text="Assign Supervisor" />

//         {/* Add Materials */}
//         <Add_items path="add-materials" text="Add Materials" />

//         {/* Submit Button */}
//         <Submit_bbutt text="Assign Task" />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },

//   form: {
//     paddingHorizontal: 15,
//   },

//   label: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 3,
//     marginTop: 16,
//     fontWeight: "600",
//   },

//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     marginBottom: 15,
//   },
// });


// import React, { useRef } from "react";
// import {
//   Animated,
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   StatusBar
// } from "react-native";

// const HEADER_MAX_HEIGHT = 120;
// const HEADER_MIN_HEIGHT = 60;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// export default function DynamicHeaderScreen() {
//   const scrollY = useRef(new Animated.Value(0)).current;

//   const headerHeight = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
//     extrapolate: "clamp",
//   });

//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
//     outputRange: [1, 0.5, 0],
//     extrapolate: "clamp",
//   });

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Dynamic Header */}
//       <Animated.View style={[styles.header, { height: headerHeight }]}>
//         <Animated.Text style={[styles.headerText, { opacity: headerOpacity }]}>
//           Dynamic Header
//         </Animated.Text>
//       </Animated.View>

//       {/* Scrollable content */}
//       <Animated.ScrollView
//         contentContainerStyle={styles.scrollContent}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//       >
//         {Array.from({ length: 30 }).map((_, i) => (
//           <View key={i} style={styles.item}>
//             <Text style={styles.itemText}>Item {i + 1}</Text>
//           </View>
//         ))}
//       </Animated.ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f4f4f4",
//   },
//   header: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#4a90e2",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1,
//     elevation: 4,
//   },
//   headerText: {
//     color: "white",
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   scrollContent: {
//     paddingTop: HEADER_MAX_HEIGHT,
//   },
//   item: {
//     backgroundColor: "white",
//     marginVertical: 5,
//     marginHorizontal: 10,
//     padding: 20,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   itemText: {
//     fontSize: 18,
//   },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView
} from "react-native";

export default function App() {
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>Show Popup</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Hello!</Text>
            <Text>This is a popup screen in React Native.</Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#FF5555" }]}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5"
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center"
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  }
});
