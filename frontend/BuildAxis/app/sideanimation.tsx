// // import * as React from "react";
// // import { View, Text, StyleSheet } from "react-native";
// // import { TabView, SceneMap, TabBar } from "react-native-tab-view";

// // const HomeRoute = () => (
// //   <View style={styles.screen}>
// //     <Text style={styles.text}>🏠 Home</Text>
// //   </View>
// // );

// // const ProfileRoute = () => (
// //   <View style={styles.screen}>
// //     <Text style={styles.text}>👤 Profile</Text>
// //   </View>
// // );

// // const SettingsRoute = () => (
// //   <View style={styles.screen}>
// //     <Text style={styles.text}>⚙️ Settings</Text>
// //   </View>
// // );

// // export default function App() {
// //   const [index, setIndex] = React.useState(2);
// //   const [routes] = React.useState([
// //     { key: "home", title: "Home" },
// //     { key: "profile", title: "Profile" },
// //     { key: "settings", title: "Settings" },
// //   ]);

// //   const renderScene = SceneMap({
// //     home: HomeRoute,
// //     profile: ProfileRoute,
// //     settings: SettingsRoute,
// //   });

// //   // 👉 Custom TabBar with styling
// //   const renderTabBar = (props: any) => (
// //     <TabBar
// //       {...props}
// //       style={styles.tabBar}                // background style
// //       indicatorStyle={styles.indicator}    // line below active tab
// //       labelStyle={styles.label}            // text style
// //       activeColor="black"
// //       inactiveColor="lightgray"
// //     />
// //   );

// //   return (
// //     <TabView
// //       navigationState={{ index, routes }}
// //       renderScene={renderScene}
// //       onIndexChange={setIndex}
// //       renderTabBar={renderTabBar} // <-- add custom tab bar
// //       swipeEnabled={true}
// //     />
// //   );
// // }

// // const styles = StyleSheet.create({
// //   screen: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   text: {
// //     fontSize: 22,
    
// //   },
// //   // 👉 Top Tab Styles
// //   tabBar: {
// //     backgroundColor: "#ffffffff", // Blue background
// //   },
// //   indicator: {
// //     backgroundColor: "black",  // Yellow line under active tab
// //     height: 3,
// //   },
// //   label: {
// //     fontSize: 14,
// //     fontWeight: "bold",
// //      backgroundColor: "black",
// //   },
// // });


// import * as React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import PagerView from "react-native-pager-view";
// import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
// import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
// import ImageScreen from "@/components/Sites/tasks/ImageScreen";
// import MaterialsScreen from "@/components/Sites/tasks/attachmentScreen";

// const { width, height } = Dimensions.get("window");

// export default function Sidesanim() {
//   const [page, setPage] = React.useState(0);

//   return (
//     <PagerView
//       style={styles.pagerView}
//       initialPage={0}
//       onPageSelected={(e) => setPage(e.nativeEvent.position)}
//     >
//       <View key="1" style={styles.page}>
//         <ImageScreen />
//       </View>

//       <View key="2" style={styles.page}>
//         <Labour_list />
//       </View>

//       <View key="3" style={styles.page}>
//         <ItemTable />
//       </View>

//       <View key="4" style={styles.page}>
//         <MaterialsScreen />
//       </View>
//     </PagerView>
//   );
// }

// const styles = StyleSheet.create({
//   pagerView: {
//     flex: 1,
//   },
//   page: {
    
//   },
// });



import * as React from "react";
import { useWindowDimensions, ScrollView, View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

// 🔹 Import your screens
import Labour_list from "@/app/(tabs)/sites/[siteId]/tabs/labourScreen";
import ItemTable from "@/app/(tabs)/sites/[siteId]/tabs/itemScreen";
import ImageScreen from "@/components/Sites/tasks/ImageScreen";
import MaterialsScreen from "@/components/Sites/tasks/attachmentScreen";

export default function TopTabs() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "images", title: "Images" },
    { key: "labours", title: "Labours" },
    { key: "materials", title: "Materials" },
    { key: "attachments", title: "Attachments" },
  ]);

  // ✅ wrap each screen inside a ScrollView
  const renderScene = SceneMap({
    images: () => (
      <ScrollView style={{ flex: 1 }}>
        <ImageScreen />
      </ScrollView>
    ),
    labours: () => (
      <ScrollView style={{ flex: 1 }}>
        <Labour_list />
      </ScrollView>
    ),
    materials: () => (
      <ScrollView style={{ flex: 1 }}>
        <ItemTable />
      </ScrollView>
    ),
    attachments: () => (
      <ScrollView style={{ flex: 1 }}>
        <MaterialsScreen />
      </ScrollView>
    ),
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "#007AFF", height: 3 }}
          style={{ backgroundColor: "white" }}
          labelStyle={{ color: "black", fontWeight: "bold" }}
          inactiveColor="#555"
          activeColor="#007AFF"
        />
      )}
    />
  );
}

