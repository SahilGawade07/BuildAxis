import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import * as Contacts from "expo-contacts";

interface Contact {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phoneNumbers: {
    id: string;
    label: string;
    number: string;
  }[];
}

interface ContactPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectContact: (phoneNumber: string) => void;
}

export default function ContactPicker({
  visible,
  onClose,
  onSelectContact,
}: ContactPickerProps) {
  const { theme } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const processPhoneNumber = (phoneNumber: string): string => {
    // Remove spaces, dashes, parentheses
    let cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");

    // If number starts with +, remove the + and first two digits (country code)
    if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.substring(3); // Remove + and first two digits
    }

    return cleanPhone;
  };

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) {
      return contacts;
    }

    const query = searchQuery.toLowerCase().trim();
    return contacts.filter((contact) => {
      const displayName =
        contact.name ||
        `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
        "Unknown";

      const phoneNumbers = contact.phoneNumbers
        .map((phone) => processPhoneNumber(phone.number))
        .join(" ");

      return (
        displayName.toLowerCase().includes(query) ||
        phoneNumbers.includes(query)
      );
    });
  }, [contacts, searchQuery]);

  const requestContactsPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting contacts permission:", error);
      return false;
    }
  }, []);

  const checkContactsPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Contacts.getPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error checking contacts permission:", error);
      return false;
    }
  }, []);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      let hasPermission = await checkContactsPermission();

      if (!hasPermission) {
        hasPermission = await requestContactsPermission();

        if (!hasPermission) {
          Alert.alert(
            "Permission Required",
            "Contacts permission is required to select a contact. Please enable it in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Settings",
                onPress: () => {
                  Alert.alert(
                    "Settings",
                    "Please go to your device settings and enable contacts permission for this app."
                  );
                },
              },
            ]
          );
          setLoading(false);
          return;
        }
      }

      setPermissionGranted(true);

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Name,
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
        ],
      });

      if (data.length > 0) {
        const contactsWithPhone = data
          .filter(
            (
              contact
            ): contact is Contacts.Contact & {
              id: string;
              phoneNumbers: Contacts.PhoneNumber[];
            } =>
              Boolean(contact.phoneNumbers) &&
              contact.phoneNumbers!.length > 0 &&
              Boolean(contact.id)
          )
          .map((contact) => ({
            id: contact.id!,
            name: contact.name || "",
            firstName: contact.firstName || "",
            lastName: contact.lastName || "",
            phoneNumbers: contact.phoneNumbers.map((phone) => ({
              id: phone.id || "",
              label: phone.label || "",
              number: phone.number || "",
            })),
          }))
          .sort((a, b) => {
            const nameA = (a.name || a.firstName || "").toLowerCase();
            const nameB = (b.name || b.firstName || "").toLowerCase();
            return nameA.localeCompare(nameB);
          });

        setContacts(contactsWithPhone);
      } else {
        setContacts([]);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
      Alert.alert(
        "Error",
        "Failed to load contacts. Please check your permissions or try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  }, [checkContactsPermission, requestContactsPermission]);

  useEffect(() => {
    if (visible) {
      loadContacts();
      setSearchQuery(""); // Reset search when modal opens
    }
  }, [visible, loadContacts]);

  const handleContactSelect = (contact: Contact) => {
    if (contact.phoneNumbers.length === 1) {
      const phoneNumber = contact.phoneNumbers[0].number;
      const cleanPhone = processPhoneNumber(phoneNumber);
      onSelectContact(cleanPhone);
      onClose();
    } else {
      const phoneOptions = contact.phoneNumbers.map((phone) => ({
        text: `${phone.label || "Phone"} - ${phone.number}`,
        onPress: () => {
          const cleanPhone = processPhoneNumber(phone.number);
          onSelectContact(cleanPhone);
          onClose();
        },
      }));

      phoneOptions.push({
        text: "Cancel",
        onPress: () => {},
      });

      Alert.alert(
        "Select Phone Number",
        `Choose a phone number for ${contact.name || contact.firstName}:`,
        phoneOptions
      );
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getContactInitials = (contact: Contact) => {
    const displayName =
      contact.name ||
      `${contact.firstName || ""} ${contact.lastName || ""}`.trim();

    if (!displayName || displayName === "Unknown") return "?";

    const names = displayName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  const renderContact = ({ item }: { item: Contact }) => {
    const displayName =
      item.name ||
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      "Unknown";
    const phoneNumber = item.phoneNumbers[0]?.number || "";
    const phoneLabel = item.phoneNumbers[0]?.label || "Phone";
    const initials = getContactInitials(item);
    const hasMultipleNumbers = item.phoneNumbers.length > 1;

    return (
      <TouchableOpacity
        style={[
          styles.contactItem,
          {
            backgroundColor: theme.listItemFill,
            borderBottomColor: theme.listItemBorder,
          },
        ]}
        onPress={() => handleContactSelect(item)}
        activeOpacity={0.7}
      >
        <View
          style={[styles.avatarContainer, { backgroundColor: theme.secondary }]}
        >
          <Text style={[styles.avatarText, { color: "#FFFFFF" }]}>
            {initials}
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactHeader}>
            <Text style={[styles.contactName, { color: theme.text }]}>
              {displayName}
            </Text>
            {hasMultipleNumbers && (
              <View
                style={[
                  styles.multipleNumbersBadge,
                  { backgroundColor: theme.secondary },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#FFFFFF" }]}>
                  {item.phoneNumbers.length}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.contactPhone, { color: theme.icons }]}>
            {phoneLabel}: {phoneNumber}
          </Text>
        </View>

        <View style={styles.chevron}>
          <Text style={[styles.chevronText, { color: theme.icons }]}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.sepratorLine,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text
                style={[styles.closeButtonText, { color: theme.secondary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Select Contact
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: theme.backgroundgrey,
                borderColor: theme.listItemBorder,
              },
            ]}
          >
            <Text style={[styles.searchIcon, { color: theme.icons }]}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search contacts..."
              placeholderTextColor={theme.icons}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearButton}
              >
                <Text style={[styles.clearButtonText, { color: theme.icons }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.secondary} />
              <Text style={[styles.loadingText, { color: theme.text }]}>
                Loading contacts...
              </Text>
            </View>
          ) : !permissionGranted ? (
            <View style={styles.permissionContainer}>
              <Text style={[styles.permissionIcon]}>📱</Text>
              <Text style={[styles.permissionTitle, { color: theme.text }]}>
                Contacts Access Needed
              </Text>
              <Text style={[styles.permissionText, { color: theme.icons }]}>
                To select contacts, we need access to your contacts list.
              </Text>
              <TouchableOpacity
                style={[
                  styles.permissionButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={loadContacts}
              >
                <Text
                  style={[styles.permissionButtonText, { color: "#FFFFFF" }]}
                >
                  Grant Permission
                </Text>
              </TouchableOpacity>
            </View>
          ) : filteredContacts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>{searchQuery ? "🔍" : "📇"}</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {searchQuery ? "No Results" : "No Contacts"}
              </Text>
              <Text style={[styles.emptyText, { color: theme.icons }]}>
                {searchQuery
                  ? `No contacts found matching "${searchQuery}"`
                  : "No contacts with phone numbers found."}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  onPress={clearSearch}
                  style={styles.clearSearchButton}
                >
                  <Text
                    style={[styles.clearSearchText, { color: theme.secondary }]}
                  >
                    Clear Search
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {searchQuery && (
                <View style={styles.searchResults}>
                  <Text
                    style={[styles.searchResultsText, { color: theme.icons }]}
                  >
                    {filteredContacts.length} result
                    {filteredContacts.length !== 1 ? "s" : ""} found
                  </Text>
                </View>
              )}
              <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contactList}
                keyboardShouldPersistTaps="handled"
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60, // Account for status bar
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  placeholder: {
    width: 60, // Balance the layout
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  clearButtonText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  searchResults: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchResultsText: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  clearSearchButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearSearchText: {
    fontSize: 16,
    fontWeight: "500",
  },
  contactList: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
  },
  contactInfo: {
    flex: 1,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  multipleNumbersBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  contactPhone: {
    fontSize: 14,
    lineHeight: 18,
  },
  chevron: {
    marginLeft: 8,
  },
  chevronText: {
    fontSize: 20,
    fontWeight: "300",
  },
});
