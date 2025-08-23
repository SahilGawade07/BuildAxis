import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

interface PersonListItemProps {
  person: {
    _id: string;
    fName?: string;
    lName?: string;
    vendorName?: string;
    profilePic: string;
    role?: string;
    email?: string;
    phone?: string | number;
    work?: string;
    contactPerson?: string;
    phoneNo?: number;
    type: "user" | "labour" | "vendor";
  };
  onPress?: () => void;
}

export const PersonListItem: React.FC<PersonListItemProps> = ({
  person,
  onPress,
}) => {
  const { theme } = useTheme();

  const getDisplayName = () => {
    if (person.type === "vendor") {
      return person.vendorName || "Unknown Vendor";
    }
    return (
      `${person.fName || ""} ${person.lName || ""}`.trim() || "Unknown Person"
    );
  };

  const getSubText = () => {
    if (person.type === "user") {
      return person.role === "supervisor" ? "Supervisor" : "Promoter";
    } else if (person.type === "labour") {
      return person.work || "Labour";
    } else if (person.type === "vendor") {
      return person.contactPerson || "Vendor";
    }
    return "";
  };

  const getContactInfo = () => {
    const phone = person.phone || person.phoneNo;
    if (person.type === "user" && person.email) {
      return person.email;
    } else if (phone) {
      return phone.toString();
    }
    return "";
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.listItemFill }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={
            person.profilePic
              ? { uri: person.profilePic }
              : require("../../../assets/images/logo.jpg")
          }
          style={styles.avatar}
          defaultSource={require("../../../assets/images/logo.jpg")}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {getDisplayName()}
        </Text>

        <Text style={[styles.role, { color: theme.icons }]} numberOfLines={1}>
          {getSubText()}
        </Text>

        {getContactInfo() && (
          <Text
            style={[styles.contact, { color: theme.icons }]}
            numberOfLines={1}
          >
            {getContactInfo()}
          </Text>
        )}
      </View>

      <View style={styles.arrowContainer}>
        <Text style={[styles.arrow, { color: theme.icons }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    marginBottom: 2,
  },
  contact: {
    fontSize: 12,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
