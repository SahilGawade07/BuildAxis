import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// Reusable components
import Submit_bbutt from "@/components/ui/SubmitBtn";
import TextInputs from "@/components/ui/inputField";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addExpenseRequest,
  getSiteTools,
  getSiteInventory,
  getOrganizationVendors,
} from "@/lib/api";

interface ReceiptImage {
  uri: string;
  name: string;
  type: string;
}

export default function CreatePaymentScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const siteId =
    typeof params.siteId === "string"
      ? params.siteId
      : Array.isArray(params.siteId)
      ? params.siteId[0]
      : undefined;

  // Additional validation and debugging
  useEffect(() => {
    console.log("Raw params:", params);
    console.log("Extracted siteId:", siteId);
    console.log("SiteId type:", typeof siteId);
    console.log("SiteId length:", siteId?.length);

    // Check if siteId looks like a valid MongoDB ObjectId (24 character hex string)
    if (siteId && typeof siteId === "string") {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(siteId);
      console.log("Is valid ObjectId format:", isValidObjectId);

      if (!isValidObjectId) {
        console.error(
          "Invalid siteId format. Expected 24 character hex string, got:",
          siteId
        );
      }
    }
  }, [params, siteId]);

  // State for form inputs
  const [billName, setBillName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [billDescription, setBillDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [note, setNote] = useState("");
  const [dueAmount, setDueAmount] = useState("");

  // State for file uploads
  const [receiptImages, setReceiptImages] = useState<ReceiptImage[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // State for tool/inventory selection
  const [siteTools, setSiteTools] = useState<any[]>([]);
  const [siteInventory, setSiteInventory] = useState<any[]>([]);
  const [organizationVendors, setOrganizationVendors] = useState<any[]>([]);
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedInventory, setSelectedInventory] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [showToolForm, setShowToolForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  // Tool form fields
  const [toolName, setToolName] = useState("");
  const [toolUnit, setToolUnit] = useState("");
  const [toolQuantity, setToolQuantity] = useState("");
  const [toolCategory, setToolCategory] = useState("");
  const [toolRemark, setToolRemark] = useState("");

  // Inventory form fields
  const [inventoryName, setInventoryName] = useState("");
  const [inventoryQuantity, setInventoryQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unit, setUnit] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingTools, setLoadingTools] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);

  useEffect(() => {
    console.log(
      "useEffect triggered with siteId:",
      siteId,
      "type:",
      typeof siteId
    );
    requestPermissions();
    if (siteId && typeof siteId === "string" && siteId.length > 0) {
      // Validate that siteId is a valid MongoDB ObjectId format
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(siteId);
      if (isValidObjectId) {
        fetchSiteTools();
        fetchSiteInventory();
        fetchOrganizationVendors();
      } else {
        console.error("Invalid siteId format:", siteId);
        Alert.alert("Error", "Invalid Site ID format");
      }
    } else {
      console.error("Invalid siteId:", siteId);
    }
  }, [siteId]);

  const requestPermissions = async () => {
    try {
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(
        libraryStatus === "granted" && cameraStatus === "granted"
      );
    } catch (error) {
      console.error("Permission request error:", error);
      setHasPermission(false);
    }
  };

  const fetchSiteTools = async () => {
    if (!siteId || typeof siteId !== "string" || siteId.length === 0) {
      console.error("Invalid siteId for tools fetch:", siteId);
      return;
    }
    setLoadingTools(true);
    try {
      console.log("Fetching tools for siteId:", siteId);
      const response = await getSiteTools(siteId);
      if (response.success) {
        setSiteTools(response.data || []);
      } else {
        console.error("Failed to fetch tools:", response.message);
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
    } finally {
      setLoadingTools(false);
    }
  };

  const fetchSiteInventory = async () => {
    if (!siteId || typeof siteId !== "string" || siteId.length === 0) {
      console.error("Invalid siteId for inventory fetch:", siteId);
      return;
    }
    setLoadingInventory(true);
    try {
      console.log("Fetching inventory for siteId:", siteId);
      const response = await getSiteInventory(siteId);
      if (response.success) {
        setSiteInventory(response.data || []);
      } else {
        console.error("Failed to fetch inventory:", response.message);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchOrganizationVendors = async () => {
    try {
      const response = await getOrganizationVendors();
      if (response.success) {
        setOrganizationVendors(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const pickImage = async () => {
    if (!hasPermission) {
      Alert.alert(
        "Permission needed",
        "Please grant camera and photo library permissions"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setReceiptImages((prev) => [
          ...prev,
          {
            uri: asset.uri,
            name: `receipt_${Date.now()}.jpg`,
            type: "image/jpeg",
          },
        ]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
    setShowImagePicker(false);
  };

  const takePhoto = async () => {
    if (!hasPermission) {
      Alert.alert("Permission needed", "Please grant camera permissions");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setReceiptImages((prev) => [
          ...prev,
          {
            uri: asset.uri,
            name: `receipt_${Date.now()}.jpg`,
            type: "image/jpeg",
          },
        ]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const removeImage = (index: number) => {
    setReceiptImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!siteId || typeof siteId !== "string" || siteId.length === 0) {
      Alert.alert("Error", "Site ID is required");
      console.error("Invalid siteId in handleSubmit:", siteId);
      return;
    }

    // Validate that siteId is a valid MongoDB ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(siteId);
    if (!isValidObjectId) {
      Alert.alert("Error", "Invalid Site ID format");
      console.error("Invalid siteId format in handleSubmit:", siteId);
      return;
    }

    console.log("Submitting expense for siteId:", siteId);

    if (!billName || !amount || !selectedPayment || !selectedCategory) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    let expenseData: any;
    try {
      console.log("Creating expense data with siteId:", siteId);
      console.log("SiteId type:", typeof siteId);
      console.log("SiteId value:", siteId);

      // Get current user ID from AsyncStorage
      const userInfoStr = await AsyncStorage.getItem("userInfo");
      if (!userInfoStr) {
        Alert.alert("Error", "User not logged in or session expired.");
        setLoading(false);
        return;
      }

      const userInfo = JSON.parse(userInfoStr);
      console.log("User info from AsyncStorage:", userInfo);
      const currentUserId = userInfo.id || userInfo._id;

      if (!currentUserId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      // Validate that currentUserId is a valid MongoDB ObjectId format
      const isValidUserId = /^[0-9a-fA-F]{24}$/.test(currentUserId);
      if (!isValidUserId) {
        Alert.alert("Error", "Invalid user ID format. Please log in again.");
        console.error("Invalid user ID format:", currentUserId);
        setLoading(false);
        return;
      }

      console.log("Current user ID:", currentUserId);

      expenseData = {
        siteId: siteId,
        description: billDescription || billName,
        amount: parseFloat(amount),
        date: date,
        paidBy: currentUserId,
        paymentMethod: selectedPayment,
        category: selectedCategory,
        vendor: selectedVendor || vendorName || undefined,
        note: note,
        receipts: receiptImages,
      };

      if (dueAmount) {
        expenseData.dueAmount = parseFloat(dueAmount);
      }

      // Add tool-specific data
      if (selectedCategory === "tool") {
        if (selectedTool) {
          expenseData.existingToolId = selectedTool;
        } else if (showToolForm) {
          expenseData.toolName = toolName;
          expenseData.toolUnit = toolUnit;
          expenseData.toolQuantity = parseInt(toolQuantity);
          expenseData.toolCategory = toolCategory;
          expenseData.toolRemark = toolRemark;
        }
      }

      // Add inventory-specific data
      if (selectedCategory === "inventory") {
        if (selectedInventory) {
          expenseData.existingInventoryId = selectedInventory;
        } else if (showInventoryForm) {
          expenseData.inventoryName = inventoryName;
          expenseData.inventoryQuantity = parseInt(inventoryQuantity);
          expenseData.unitPrice = parseFloat(unitPrice);
          expenseData.unit = unit;
        }
      }

      const response = await addExpenseRequest(expenseData);

      if (response.success) {
        Alert.alert("Success", "Expense added successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", response.message || "Failed to add expense");
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
      console.error("Expense data that was sent:", expenseData);
      Alert.alert("Error", "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const renderToolForm = () => {
    if (selectedCategory !== "tool") return null;

    return (
      <View style={styles.formSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Tool Information
        </Text>

        <View style={styles.selectionContainer}>
          <Text style={[styles.label, { color: theme.text }]}>
            Use existing tool or create new?
          </Text>

          <View style={styles.selectionButtons}>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                !showToolForm && styles.selectedButton,
                { borderColor: theme.primary },
              ]}
              onPress={() => setShowToolForm(false)}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  !showToolForm && { color: theme.primary },
                ]}
              >
                Existing Tool
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectionButton,
                showToolForm && styles.selectedButton,
                { borderColor: theme.primary },
              ]}
              onPress={() => setShowToolForm(true)}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  showToolForm && { color: theme.primary },
                ]}
              >
                New Tool
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {!showToolForm ? (
          <View style={styles.pickerContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              Select Tool
            </Text>
            <Picker
              selectedValue={selectedTool}
              onValueChange={setSelectedTool}
              style={[styles.picker, { color: theme.text }]}
            >
              <Picker.Item label="Select a tool..." value="" />
              {siteTools.map((tool) => (
                <Picker.Item
                  key={tool._id}
                  label={`${tool.name} (${tool.quantity} ${tool.unit})`}
                  value={tool._id}
                />
              ))}
            </Picker>
          </View>
        ) : (
          <View style={styles.formFields}>
            <TextInputs
              placeholder="Tool Name"
              value={toolName}
              onChangeText={setToolName}
              textname="Tool Name"
            />
            <TextInputs
              placeholder="Unit (e.g., pieces, kg)"
              value={toolUnit}
              onChangeText={setToolUnit}
              textname="Unit"
            />
            <TextInputs
              placeholder="Quantity"
              value={toolQuantity}
              onChangeText={setToolQuantity}
              keyboardType="numeric"
              textname="Quantity"
            />
            <View style={styles.pickerContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                Category
              </Text>
              <Picker
                selectedValue={toolCategory}
                onValueChange={setToolCategory}
                style={[styles.picker, { color: theme.text }]}
              >
                <Picker.Item label="Select category..." value="" />
                <Picker.Item label="Owned" value="owned" />
                <Picker.Item label="Rented" value="rented" />
              </Picker>
            </View>
            <TextInputs
              placeholder="Remark (optional)"
              value={toolRemark}
              onChangeText={setToolRemark}
              textname="Remark"
            />
          </View>
        )}
      </View>
    );
  };

  const renderInventoryForm = () => {
    if (selectedCategory !== "inventory") return null;

    return (
      <View style={styles.formSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Inventory Information
        </Text>

        <View style={styles.selectionContainer}>
          <Text style={[styles.label, { color: theme.text }]}>
            Use existing inventory or create new?
          </Text>

          <View style={styles.selectionButtons}>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                !showInventoryForm && styles.selectedButton,
                { borderColor: theme.primary },
              ]}
              onPress={() => setShowInventoryForm(false)}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  !showInventoryForm && { color: theme.primary },
                ]}
              >
                Existing Inventory
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.selectionButton,
                showInventoryForm && styles.selectedButton,
                { borderColor: theme.primary },
              ]}
              onPress={() => setShowInventoryForm(true)}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  showInventoryForm && { color: theme.primary },
                ]}
              >
                New Inventory
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {!showInventoryForm ? (
          <View style={styles.pickerContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              Select Inventory
            </Text>
            <Picker
              selectedValue={selectedInventory}
              onValueChange={setSelectedInventory}
              style={[styles.picker, { color: theme.text }]}
            >
              <Picker.Item label="Select inventory..." value="" />
              {siteInventory.map((item) => (
                <Picker.Item
                  key={item._id}
                  label={`${item.name} (${item.quantity} ${item.unit})`}
                  value={item._id}
                />
              ))}
            </Picker>
          </View>
        ) : (
          <View style={styles.formFields}>
            <TextInputs
              placeholder="Inventory Name"
              value={inventoryName}
              onChangeText={setInventoryName}
              textname="Inventory Name"
            />
            <TextInputs
              placeholder="Quantity"
              value={inventoryQuantity}
              onChangeText={setInventoryQuantity}
              keyboardType="numeric"
              textname="Quantity"
            />
            <TextInputs
              placeholder="Unit Price"
              value={unitPrice}
              onChangeText={setUnitPrice}
              keyboardType="numeric"
              textname="Unit Price"
            />
            <TextInputs
              placeholder="Unit (e.g., pieces, kg)"
              value={unit}
              onChangeText={setUnit}
              textname="Unit"
            />
          </View>
        )}
      </View>
    );
  };

  const renderReceiptSection = () => (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Receipt Images
      </Text>

      <View style={styles.receiptButtons}>
        <TouchableOpacity
          style={[styles.receiptButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowImagePicker(true)}
        >
          <Ionicons name="images" size={20} color="white" />
          <Text style={[styles.receiptButtonText, { color: "white" }]}>
            Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.receiptButton, { backgroundColor: theme.primary }]}
          onPress={takePhoto}
        >
          <Ionicons name="camera" size={20} color="white" />
          <Text style={[styles.receiptButtonText, { color: "white" }]}>
            Camera
          </Text>
        </TouchableOpacity>
      </View>

      {receiptImages.length > 0 && (
        <View style={styles.imageGrid}>
          {receiptImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.receiptImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Add Expense" />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.form}>
          <Text style={[styles.title, { color: theme.text }]}>
            Add New Expense
          </Text>

          {/* Basic Information */}
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Basic Information
            </Text>

            <TextInputs
              placeholder="Bill Name *"
              value={billName}
              onChangeText={setBillName}
              textname="Bill Name"
            />

            <View style={styles.pickerContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                Vendor (optional)
              </Text>
              <Picker
                selectedValue={selectedVendor}
                onValueChange={setSelectedVendor}
                style={[styles.picker, { color: theme.text }]}
              >
                <Picker.Item label="Select vendor..." value="" />
                {organizationVendors.map((vendor) => (
                  <Picker.Item
                    key={vendor._id}
                    label={`${vendor.vendorName} - ${vendor.contactPerson}`}
                    value={vendor._id}
                  />
                ))}
              </Picker>
            </View>

            <TextInputs
              placeholder="Vendor Name (manual entry)"
              value={vendorName}
              onChangeText={setVendorName}
              textname="Vendor Name"
            />

            <TextInputs
              placeholder="Description (optional)"
              value={billDescription}
              onChangeText={setBillDescription}
              textname="Description"
            />

            <TextInputs
              placeholder="Amount *"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              textname="Amount"
            />

            <TextInputs
              placeholder="Due Amount (optional)"
              value={dueAmount}
              onChangeText={setDueAmount}
              keyboardType="numeric"
              textname="Due Amount"
            />

            <View style={styles.pickerContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                Payment Method *
              </Text>
              <Picker
                selectedValue={selectedPayment}
                onValueChange={setSelectedPayment}
                style={[styles.picker, { color: theme.text }]}
              >
                <Picker.Item label="Select payment method..." value="" />
                <Picker.Item label="Cash" value="cash" />
                <Picker.Item label="Card" value="card" />
                <Picker.Item label="UPI" value="UPI" />
                <Picker.Item label="Bank Transfer" value="bank transfer" />
                <Picker.Item label="Cheque" value="cheque" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                Category *
              </Text>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
                style={[styles.picker, { color: theme.text }]}
              >
                <Picker.Item label="Select category..." value="" />
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Tool" value="tool" />
                <Picker.Item label="Inventory" value="inventory" />
                <Picker.Item label="Rental" value="rental" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <TextInputs
              placeholder="Note (optional)"
              value={note}
              onChangeText={setNote}
              textname="Note"
            />
          </View>

          {/* Tool Form */}
          {renderToolForm()}

          {/* Inventory Form */}
          {renderInventoryForm()}

          {/* Receipt Section */}
          {renderReceiptSection()}

          {/* Submit Button */}
          <Submit_bbutt
            text={loading ? "Adding Expense..." : "Add Expense"}
            onPress={handleSubmit}
            disabled={loading}
          />
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Choose from Gallery
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.primary }]}
              onPress={pickImage}
            >
              <Text style={[styles.modalButtonText, { color: "white" }]}>
                Select Image
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "gray" }]}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={[styles.modalButtonText, { color: "white" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Camera functionality is handled through image picker */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  selectionContainer: {
    marginBottom: 15,
  },
  selectionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  selectionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  formFields: {
    marginTop: 10,
  },
  receiptButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  receiptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  receiptButtonText: {
    color: "white",
    fontWeight: "500",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imageContainer: {
    position: "relative",
  },
  receiptImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
