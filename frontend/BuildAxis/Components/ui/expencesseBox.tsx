// import { Ionicons } from "@expo/vector-icons";
// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useTheme } from "../../context/ThemeContext";

// export const Expencess = ({ item }: any) => {
//   const { theme } = useTheme();

//   return (
//     <TouchableOpacity
//       style={[
//         styles.sitecard,
//         {
//           backgroundColor: theme.listItemFill,
//           borderColor: theme.listItemBorder,
//         },
//       ]}
//       activeOpacity={0.8}
//     >
//       {/* Card Header */}
//       <View style={styles.cardHeader}>
//         {/* Left side: Project image placeholder + name */}
//         <View style={styles.cardHeaderLeft}>
//           <View
//             style={[styles.imageBox, { backgroundColor: theme.boxes01[0] }]}
//           >
//             <Ionicons name="image-outline" size={28} color={theme.icons} />
//           </View>
//           <View>
//             <Text style={[styles.sitename, { color: theme.text }]}>
//               {item.name}
//             </Text>
//             <Text style={[styles.text, { fontSize: 12, color: theme.text }]}>
//               Soham Darade
//             </Text>
//           </View>
//         </View>

//         {/* Right side: Active badge */}
//         <View
//           style={[styles.activeBadge, { backgroundColor: theme.secondary }]}
//         >
//           <Text style={[styles.activeText, { color: theme.background }]}>
//             {item.status}
//           </Text>
//         </View>
//       </View>

//       {/* Card Footer */}
//       <View style={[styles.cardFooter, { borderColor: theme.listItemBorder }]}>
//         {/* Project progress */}
//         <View style={styles.progressRow}>
//           <Text style={[styles.progressText, { color: theme.text }]}>
//             {item.progress}
//           </Text>
//         </View>

//         {/* Project date */}
//         <View style={styles.dateRow}>
//           <Ionicons name="calendar-outline" size={18} color={theme.icons} />
//           <Text style={[styles.dateText, { color: theme.text }]}>
//             {item.date}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   text: {
//     fontSize: 18,
//   },

//   // Image placeholder box
//   imageBox: {
//     width: 50,
//     height: 50,
//     backgroundColor: "#EAEFFF",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },

//   // Card header styling
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   cardHeaderLeft: { flexDirection: "row", alignItems: "center" },

//   // Active status badge
//   activeBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//     alignItems: "center",
//   },
//   activeText: { fontSize: 12, fontWeight: "500" },

//   // Card footer styling
//   cardFooter: {
//     borderTopWidth: 1.5,
//     marginTop: 10,
//     paddingTop: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   // Progress & date rows
//   progressRow: { flexDirection: "row", alignItems: "center" },
//   progressText: { marginLeft: 4, fontSize: 12 },
//   dateRow: { flexDirection: "row", alignItems: "center" },
//   dateText: { marginLeft: 4, fontSize: 12 },

//   // Project card styling
//   sitecard: {
//     marginHorizontal: 15,
//     marginBottom: 20,
//     padding: 10,
//     borderRadius: 8,
//     borderWidth: 1.6,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 1,
//   },

//   // Project name text
//   sitename: { fontSize: 16, fontWeight: "500" },
// });




import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

export const Expencess = ({ item }: any) => {
  const { theme } = useTheme();

  // pick one of the color sets (rotate for variety)
  const variants = [theme.boxes04, theme.boxes02, theme.boxes02, theme.boxes04];
  const variant = variants[item.id % variants.length]; // based on item id

  const [cardBg, circleBg, iconColor] = variant;

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.wrapper}>
      <LinearGradient
        colors={[cardBg, theme.listItemFill]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.sitecard,
          { borderColor: theme.listItemBorder },
        ]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          {/* Left side */}
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.imageBox, { backgroundColor: circleBg }]}>
<FontAwesome6 name="money-bills" size={24} color={iconColor} />
            </View>
            <View>
              <Text style={[styles.sitename, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.subText, { color: theme.muted }]}>
                Soham Darade
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.activeBadge,
              { backgroundColor: iconColor + "22" }, // subtle bg
            ]}
          >
            <Text style={[styles.activeText, { color: iconColor }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { borderColor: theme.listItemBorder }]} />

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          {/* Progress */}
          <View style={styles.progressRow}>
            <Ionicons name="trending-up-outline" size={18} color={iconColor} />
            <Text style={[styles.progressText, { color: theme.text }]}>
              {item.progress}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={18} color={theme.icons} />
            <Text style={[styles.dateText, { color: theme.text }]}>
              {item.date}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 15, marginBottom: 20 },

  // Card container
  sitecard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },

  // Header layout
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center" },

  // Avatar / Icon Box
  imageBox: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  // Status Badge
  activeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 25,
  },
  activeText: { fontSize: 13, fontWeight: "600" },

  // Divider
  divider: {
    borderTopWidth: 1,
    marginVertical: 12,
  },

  // Footer layout
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressRow: { flexDirection: "row", alignItems: "center" },
  progressText: { marginLeft: 8, fontSize: 14, fontWeight: "600" },

  dateRow: { flexDirection: "row", alignItems: "center" },
  dateText: { marginLeft: 8, fontSize: 13, fontWeight: "500" },

  // Typography
  sitename: { fontSize: 17, fontWeight: "700" },
  subText: { fontSize: 12, marginTop: 2 },
});
