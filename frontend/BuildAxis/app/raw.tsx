// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { Entypo } from "@expo/vector-icons";

// const projects = [
//   {
//     id: "1",
//     name: "Project Name",
//     type: "Commercial",
//     user: "John Doe | Lahore",
//     status: "Completed",
//     price: "$234",
//     date: "Oct 2, 2020",
//     image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Ffront-end-loader&psig=AOvVaw1QLPnhyZ4ZZFap7AXEwHD7&ust=1755959454184000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIDsoO_Qno8DFQAAAAAdAAAAABAE",
//   },
//   {
//     id: "2",
//     name: "Project Name",
//     type: "Non-Commercial",
//     user: "John Doe | Lahore",
//     status: "Completed",
//     price: "$234",
//     date: "Oct 2, 2020",
//     image: "https://via.placeholder.com/60",
//   },
//   {
//     id: "3",
//     name: "Project Name",
//     type: "",
//     user: "John Doe | Lahore",
//     status: "Cancelled",
//     price: "",
//     date: "Oct 2, 2020",
//     image: "https://via.placeholder.com/60",
//   },
//   {
//     id: "4",
//     name: "Project Name",
//     type: "Commercial",
//     user: "John Doe | Lahore",
//     status: "Cancelled",
//     price: "",
//     date: "Oct 2, 2020",
//     image: "https://via.placeholder.com/60",
//   },
//   {
//     id: "5",
//     name: "Project Name",
//     type: "Commercial",
//     user: "John Doe | Lahore",
//     status: "On Going",
//     price: "$234",
//     date: "Oct 2, 2020",
//     image: "https://via.placeholder.com/60",
//   },
// ];

// const statusColors: any = {
//   Completed: "green",
//   Cancelled: "red",
//   "On Going": "#2E86C1",
// };

// export default function ProjectList() {
//   const renderItem = ({ item }: any) => (
//     <View style={styles.card}>
//       {/* Image */}
//       <View style={{ flexDirection: "row" }}>
//         <Image source={require("@/assets/images/image.png")} style={styles.image} />

//         {/* Content */}
//         <View style={styles.content}>
//           <Text style={styles.title}>
//             {item.name}{" "}
//             {item.type ? <Text style={styles.type}>({item.type})</Text> : null}
//           </Text>
//           <Text style={styles.subtitle}>{item.user}</Text>


//         </View>

//         {/* Right Side */}
//         <View style={styles.right}>
//           <TouchableOpacity>
//             <Entypo name="dots-three-vertical" size={18} color="black" />
//           </TouchableOpacity>


//         </View>
//       </View>

//       <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//         {/* Status */}
//         <View style={{ flexDirection: "row"}}>
//           <Text style={[styles.type,{marginRight:19,fontWeight: "600",}]}>Status</Text>
//           <Text style={[styles.status, { color: statusColors[item.status] }]}>
//             {item.status}
//           </Text>
//         </View>
//         <View style={styles.right}>
//           {item.price ? (
//             <Text style={styles.price}>Total {item.price}</Text>
//           ) : null}
//           <Text style={styles.date}>{item.date}</Text>
//         </View>

//       </View>


//     </View>
//   );

//   return (
//     <View style={{backgroundColor:"#fff"}}>
//     <FlatList
//       data={projects}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={{ padding: 10 }}
//     />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {


//     // padding: 12,
//     // backgroundColor: "#fff",
//     // borderRadius: 12,
//     // marginBottom: 10,
//     // borderBottomWidth:1,
//     // borderColor:"#ccc"
       
    
//     padding: 12,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 10,
//     elevation: 2, // shadow for android
//     shadowColor: "#000", // shadow for ios
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 2 },

//   },
//   image: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   content: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   type: {
//     fontSize: 14,
//     fontWeight: "400",
//     color: "gray",
//   },
//   subtitle: {
//     fontSize: 13,
//     color: "gray",
//     marginBottom: 6,
//   },
//   status: {
//     fontWeight: "bold",
//   },
//   right: {
//     alignItems: "flex-end",
//     justifyContent: "space-between",

//   },
//   price: {
//     fontSize: 13,
//     color: "#2E86C1",
//     marginBottom: 3,
//   },
//   date: {
//     fontSize: 12,
//     color: "gray",
//     marginBottom: 5,
//   },
// });



import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext"; // ✅ your theme hook

const projects = [
  {
    id: "1",
    name: "Project Name",
    type: "Commercial",
    user: "John Doe | Lahore",
    status: "Completed",
    price: "$234",
    date: "Oct 2, 2020",
    image: "https://via.placeholder.com/60",
  },
  {
    id: "2",
    name: "Project Name",
    type: "Non-Commercial",
    user: "John Doe | Lahore",
    status: "Completed",
    price: "$234",
    date: "Oct 2, 2020",
    image: "https://via.placeholder.com/60",
  },
  {
    id: "3",
    name: "Project Name",
    type: "",
    user: "John Doe | Lahore",
    status: "Cancelled",
    price: "",
    date: "Oct 2, 2020",
    image: "https://via.placeholder.com/60",
  },
  {
    id: "4",
    name: "Project Name",
    type: "Commercial",
    user: "John Doe | Lahore",
    status: "Cancelled",
    price: "",
    date: "Oct 2, 2020",
    image: "https://via.placeholder.com/60",
  },
  {
    id: "5",
    name: "Project Name",
    type: "Commercial",
    user: "John Doe | Lahore",
    status: "On Going",
    price: "$234",
    date: "Oct 2, 2020",
    image: "https://via.placeholder.com/60",
  },
];

export default function ProjectList() {
  const { theme } = useTheme(); // ✅ access theme

  const statusColors: any = {
    Completed: theme.success,
    Cancelled: theme.error,
    "On Going": theme.onging,
  };

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          shadowColor: theme.shadow,
          borderColor: theme.listItemBorder,
          borderWidth: 1,
        },
      ]}
    >
      {/* Top Row */}
      <View style={{ flexDirection: "row" }}>
        <Image
          source={require("@/assets/images/image.png")}
          style={styles.image}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>
            {item.name}{" "}
            {item.type ? (
              <Text style={[styles.type, { color: theme.muted }]}>
                ({item.type})
              </Text>
            ) : null}
          </Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            {item.user}
          </Text>
        </View>

        {/* Right Menu */}
        <View style={styles.right}>
          <TouchableOpacity>
            <Entypo name="dots-three-vertical" size={18} color={theme.muted} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Status */}
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              styles.type,
              { marginRight: 19, fontWeight: "600", color: theme.muted },
            ]}
          >
            Status
          </Text>
          <Text
            style={[styles.status, { color: statusColors[item.status] }]}
          >
            {item.status}
          </Text>
        </View>

        {/* Price & Date */}
        <View style={styles.right}>
          {item.price ? (
            <Text style={[styles.price, { color: theme.primary }]}>
              Total {item.price}
            </Text>
          ) : null}
          <Text style={[styles.date, { color: theme.muted }]}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{  flex: 1,marginHorizontal:3 }}>
      <FlatList
        data={projects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2, // android shadow
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  type: {
    fontSize: 14,
    fontWeight: "400",
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  status: {
    fontWeight: "bold",
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 13,
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    marginBottom: 5,
  },
});
