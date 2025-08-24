import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useFocusEffect } from "expo-router";

// Reusable components
import Back_Text_Butt from "@/components/ui/backBtn";
import { Safe_area } from "@/components/ui/safeArea";
import Submit_bbutt from "@/components/ui/SubmitBtn";
import { CompanyBar } from "@/components/ui/orgNameBar";
import TextInputs from "@/components/ui/inputField";
import { useTheme } from "@/context/ThemeContext";
import HeaderBar from "@/components/ui/headerBar";
import { createTaskRequest, getViewAllPeople } from "@/lib/api";
import { isPromoter } from "@/utils/isPromoter";
import { useLocalSearchParams } from "expo-router";

interface Material {
  name: string;
  quantity: number;
  unit: string;
}

interface Attachment {
  uri: string;
  name: string;
  type: string;
}

interface Supervisor {
  _id: string;
  fName: string;
  lName: string;
  email: string;
  profilePic?: string;
}

interface Labour {
  _id: string;
  fName: string;
  lName: string;
  phone: string;
  profilePic?: string;
}

export default function CreateTaskScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const siteId = Array.isArray(params.siteId)
    ? params.siteId[0]
    : params.siteId;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<"promoter" | "supervisor">(
    "promoter"
  );

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("open");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // People selection
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([]);
  const [selectedLabours, setSelectedLabours] = useState<string[]>([]);

  // Materials
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Material>({
    name: "",
    quantity: 0,
    unit: "pieces",
  });

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [images, setImages] = useState<Attachment[]>([]);

  // Organization data
  const [orgId, setOrgId] = useState("");

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  // Refresh selected people when returning from selection pages
  useFocusEffect(
    React.useCallback(() => {
      // This will run every time the screen comes into focus
      // Read stored selections from AsyncStorage
      const readStoredSelections = async () => {
        try {
          // Read stored supervisors
          const storedSupervisors = await AsyncStorage.getItem(
            "tempSelectedSupervisors"
          );
          if (storedSupervisors) {
            const supervisorIds = JSON.parse(storedSupervisors);
            setSelectedSupervisors(supervisorIds);
            // Clear the stored data
            await AsyncStorage.removeItem("tempSelectedSupervisors");
          }

          // Read stored labours
          const storedLabours = await AsyncStorage.getItem(
            "tempSelectedLabours"
          );
          if (storedLabours) {
            const labourIds = JSON.parse(storedLabours);
            setSelectedLabours(labourIds);
            // Clear the stored data
            await AsyncStorage.removeItem("tempSelectedLabours");
          }
        } catch (error) {
          console.error("Error reading stored selections:", error);
        }
      };

      readStoredSelections();
    }, [])
  );

  const fetchOrganizationData = async () => {
    try {
      const storedInfo = await AsyncStorage.getItem("organizationInfo");
      if (storedInfo) {
        const parsed = JSON.parse(storedInfo);
        setOrgId(parsed.orgId);
        await fetchPeople(parsed.orgId);
      }

      // Check for any stored selections
      const storedSupervisors = await AsyncStorage.getItem(
        "tempSelectedSupervisors"
      );
      if (storedSupervisors) {
        const supervisorIds = JSON.parse(storedSupervisors);
        setSelectedSupervisors(supervisorIds);
        // Clear the stored data
        await AsyncStorage.removeItem("tempSelectedSupervisors");
      }

      const storedLabours = await AsyncStorage.getItem("tempSelectedLabours");
      if (storedLabours) {
        const labourIds = JSON.parse(storedLabours);
        setSelectedLabours(labourIds);
        // Clear the stored data
        await AsyncStorage.removeItem("tempSelectedLabours");
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  const fetchPeople = async (organizationId: string) => {
    try {
      // Fetch supervisors
      const supervisorsResponse = await getViewAllPeople(
        organizationId,
        "supervisor",
        1
      );
      if (supervisorsResponse.success && supervisorsResponse.data) {
        setSupervisors(supervisorsResponse.data.people || []);
      }

      // Fetch labours
      const laboursResponse = await getViewAllPeople(
        organizationId,
        "labour",
        1
      );
      if (laboursResponse.success && laboursResponse.data) {
        setLabours(laboursResponse.data.people || []);
      }
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("Form state before submission:", {
      title,
      description,
      priority,
      status,
      dueDate,
      selectedSupervisors,
      selectedLabours,
      materials,
      attachments,
      images,
    }); // Debug log

    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!siteId) {
      Alert.alert("Error", "Site ID is missing");
      return;
    }

    if (selectedSupervisors.length === 0 && selectedLabours.length === 0) {
      Alert.alert("Error", "Please select at least one supervisor or labour");
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due: dueDate.toISOString(), // Changed from dueDate to due
        site: siteId,
        supervisors: selectedSupervisors, // These are task overseers
        assignedToSupervisors: selectedSupervisors, // These are supervisors assigned to work on the task
        assignedToLabourers: selectedLabours, // These are labourers assigned to work on the task
        materials: materials || [], // Ensure materials is always an array
        attachments: attachments || [], // Ensure attachments is always an array
        images: images || [], // Ensure images is always an array
        // Removed orgId as it's not expected by the API
      };

      console.log("Sending task data:", taskData); // Debug log

      const response = await createTaskRequest(taskData);
      console.log("Task creation response:", response); // Debug log

      if (response && response.success) {
        Alert.alert("Success", "Task created successfully", [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setTitle("");
              setDescription("");
              setPriority("medium");
              setStatus("open");
              setDueDate(new Date());
              setSelectedSupervisors([]);
              setSelectedLabours([]);
              setMaterials([]);
              setAttachments([]);
              setImages([]);

              // Navigate back to the previous screen
              router.back();
            },
          },
        ]);
      } else {
        const errorMessage = response?.message || "Failed to create task";
        console.error("Task creation failed:", response); // Debug log
        Alert.alert("Error", errorMessage);
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      let errorMessage = "Failed to create task";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = () => {
    console.log("Adding material:", newMaterial); // Debug log
    if (newMaterial.name.trim() && newMaterial.quantity > 0) {
      const materialToAdd = {
        name: newMaterial.name.trim(),
        quantity: newMaterial.quantity,
        unit: newMaterial.unit,
      };
      console.log("Material to add:", materialToAdd); // Debug log
      setMaterials([...materials, materialToAdd]);
      setNewMaterial({ name: "", quantity: 0, unit: "pieces" });
      setShowMaterialModal(false);
      console.log("Materials after adding:", [...materials, materialToAdd]); // Debug log
    } else {
      console.log("Material validation failed:", {
        name: newMaterial.name.trim(),
        quantity: newMaterial.quantity,
      }); // Debug log
      Alert.alert("Error", "Please enter a valid material name and quantity");
    }
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setAttachments([
          ...attachments,
          {
            uri: asset.uri,
            name: asset.name || "Document",
            type: asset.mimeType || "application/octet-stream",
          },
        ]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImages([
          ...images,
          {
            uri: asset.uri,
            name: "Image",
            type: "image/jpeg",
          },
        ]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <HeaderBar title="Create Task" />
      <Safe_area />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Task Details
            </Text>

            <TextInputs
              textname="Task Title"
              placeholder="Task Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInputs
              textname="Description"
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Priority
                </Text>
                <Picker
                  selectedValue={priority}
                  onValueChange={setPriority}
                  style={[
                    styles.picker,
                    { backgroundColor: theme.card, color: theme.text },
                  ]}
                >
                  <Picker.Item label="Low" value="low" />
                  <Picker.Item label="Medium" value="medium" />
                  <Picker.Item label="High" value="high" />
                  <Picker.Item label="Urgent" value="urgent" />
                </Picker>
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Status
                </Text>
                <Picker
                  selectedValue={status}
                  onValueChange={setStatus}
                  style={[
                    styles.picker,
                    { backgroundColor: theme.card, color: theme.text },
                  ]}
                >
                  <Picker.Item label="Open" value="open" />
                  <Picker.Item label="In Progress" value="in_progress" />
                  <Picker.Item label="Completed" value="completed" />
                  <Picker.Item label="Verified" value="verified" />
                  <Picker.Item label="Closed" value="closed" />
                  <Picker.Item label="Cancelled" value="cancelled" />
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.listItemBorder,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={theme.icons} />
              <Text style={[styles.dateButtonText, { color: theme.text }]}>
                Due Date: {dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDueDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          {/* People Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Assign People
            </Text>

            {/* Supervisors Selection */}
            <View style={styles.selectionRow}>
              <Text style={[styles.label, { color: theme.text }]}>
                Supervisors
              </Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() =>
                  router.push(`/sites/${siteId}/selectSupervisors`)
                }
              >
                <Ionicons name="people-outline" size={20} color="white" />
                <Text style={styles.selectButtonText}>
                  {selectedSupervisors.length > 0
                    ? `${selectedSupervisors.length} Selected`
                    : "Select Supervisors"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Show selected supervisors */}
            {selectedSupervisors.length > 0 && (
              <View style={styles.selectedPeopleContainer}>
                <Text style={[styles.selectedLabel, { color: theme.muted }]}>
                  Selected Supervisors:
                </Text>
                {supervisors
                  .filter((s) => selectedSupervisors.includes(s._id))
                  .map((supervisor) => (
                    <View
                      key={supervisor._id}
                      style={[
                        styles.selectedPersonItem,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.listItemBorder,
                        },
                      ]}
                    >
                      <View style={styles.selectedPersonInfo}>
                        {supervisor.profilePic ? (
                          <Image
                            source={{ uri: supervisor.profilePic }}
                            style={styles.selectedProfilePic}
                          />
                        ) : (
                          <View
                            style={[
                              styles.selectedProfilePlaceholder,
                              { backgroundColor: theme.primary },
                            ]}
                          >
                            <Text style={styles.selectedProfilePlaceholderText}>
                              {supervisor.fName.charAt(0)}
                              {supervisor.lName.charAt(0)}
                            </Text>
                          </View>
                        )}
                        <View>
                          <Text
                            style={[
                              styles.selectedPersonName,
                              { color: theme.text },
                            ]}
                          >
                            {supervisor.fName} {supervisor.lName}
                          </Text>
                          <Text
                            style={[
                              styles.selectedPersonEmail,
                              { color: theme.muted },
                            ]}
                          >
                            {supervisor.email}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedSupervisors(
                            selectedSupervisors.filter(
                              (id) => id !== supervisor._id
                            )
                          );
                        }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color={theme.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}

            {/* Labours Selection */}
            <View style={styles.selectionRow}>
              <Text style={[styles.label, { color: theme.text }]}>Labours</Text>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={() => router.push(`/sites/${siteId}/selectLabours`)}
              >
                <Ionicons name="construct-outline" size={20} color="white" />
                <Text style={styles.selectButtonText}>
                  {selectedLabours.length > 0
                    ? `${selectedLabours.length} Selected`
                    : "Select Labours"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Show selected labours */}
            {selectedLabours.length > 0 && (
              <View style={styles.selectedPeopleContainer}>
                <Text style={[styles.selectedLabel, { color: theme.muted }]}>
                  Selected Labours:
                </Text>
                {labours
                  .filter((l) => selectedLabours.includes(l._id))
                  .map((labour) => (
                    <View
                      key={labour._id}
                      style={[
                        styles.selectedPersonItem,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.listItemBorder,
                        },
                      ]}
                    >
                      <View style={styles.selectedPersonInfo}>
                        {labour.profilePic ? (
                          <Image
                            source={{ uri: labour.profilePic }}
                            style={styles.selectedProfilePic}
                          />
                        ) : (
                          <View
                            style={[
                              styles.selectedProfilePlaceholder,
                              { backgroundColor: theme.secondary },
                            ]}
                          >
                            <Text style={styles.selectedProfilePlaceholderText}>
                              {labour.fName.charAt(0)}
                              {labour.lName.charAt(0)}
                            </Text>
                          </View>
                        )}
                        <View>
                          <Text
                            style={[
                              styles.selectedPersonName,
                              { color: theme.text },
                            ]}
                          >
                            {labour.fName} {labour.lName}
                          </Text>
                          <Text
                            style={[
                              styles.selectedPersonPhone,
                              { color: theme.muted },
                            ]}
                          >
                            {labour.phone}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedLabours(
                            selectedLabours.filter((id) => id !== labour._id)
                          );
                        }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color={theme.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}
          </View>

          {/* Materials */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Materials
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={() => setShowMaterialModal(true)}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {materials.map((material, index) => (
              <View
                key={index}
                style={[
                  styles.materialItem,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.listItemBorder,
                  },
                ]}
              >
                <View style={styles.materialInfo}>
                  <Text style={[styles.materialName, { color: theme.text }]}>
                    {material.name}
                  </Text>
                  <Text
                    style={[styles.materialQuantity, { color: theme.muted }]}
                  >
                    {material.quantity} {material.unit}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeMaterial(index)}>
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={theme.error}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Attachments */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Attachments
            </Text>

            <View style={styles.attachmentButtons}>
              <TouchableOpacity
                style={[
                  styles.attachmentButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={pickImage}
              >
                <Ionicons name="image-outline" size={20} color="white" />
                <Text style={styles.attachmentButtonText}>Add Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.attachmentButton,
                  { backgroundColor: theme.secondary },
                ]}
                onPress={pickDocument}
              >
                <Ionicons name="document-outline" size={20} color="white" />
                <Text style={styles.attachmentButtonText}>Add Document</Text>
              </TouchableOpacity>
            </View>

            {/* Show Images */}
            {images.length > 0 && (
              <View style={styles.attachmentSubsection}>
                <Text style={[styles.subsectionTitle, { color: theme.muted }]}>
                  Images ({images.length})
                </Text>
                {images.map((image, index) => (
                  <View
                    key={index}
                    style={[
                      styles.attachmentItem,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.listItemBorder,
                      },
                    ]}
                  >
                    <View style={styles.attachmentInfo}>
                      <Ionicons
                        name="image-outline"
                        size={20}
                        color={theme.icons}
                      />
                      <Text
                        style={[styles.attachmentName, { color: theme.text }]}
                      >
                        {image.name}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeImage(index)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={theme.error}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Show Documents */}
            {attachments.length > 0 && (
              <View style={styles.attachmentSubsection}>
                <Text style={[styles.subsectionTitle, { color: theme.muted }]}>
                  Documents ({attachments.length})
                </Text>
                {attachments.map((attachment, index) => (
                  <View
                    key={index}
                    style={[
                      styles.attachmentItem,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.listItemBorder,
                      },
                    ]}
                  >
                    <View style={styles.attachmentInfo}>
                      <Ionicons
                        name="document-outline"
                        size={20}
                        color={theme.icons}
                      />
                      <Text
                        style={[styles.attachmentName, { color: theme.text }]}
                      >
                        {attachment.name}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeAttachment(index)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={theme.error}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Material Modal */}
      <Modal
        visible={showMaterialModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMaterialModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Add Material
            </Text>

            <TextInputs
              textname="Material Name"
              placeholder="Material Name"
              value={newMaterial.name}
              onChangeText={(text) =>
                setNewMaterial({ ...newMaterial, name: text })
              }
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <TextInputs
                  textname="Quantity"
                  placeholder="Quantity"
                  value={newMaterial.quantity.toString()}
                  onChangeText={(text) =>
                    setNewMaterial({
                      ...newMaterial,
                      quantity: parseInt(text) || 0,
                    })
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfWidth}>
                <Picker
                  selectedValue={newMaterial.unit}
                  onValueChange={(value) =>
                    setNewMaterial({ ...newMaterial, unit: value })
                  }
                  style={[
                    styles.picker,
                    { backgroundColor: theme.card, color: theme.text },
                  ]}
                >
                  <Picker.Item label="Pieces" value="pieces" />
                  <Picker.Item label="Kg" value="kg" />
                  <Picker.Item label="Liters" value="liters" />
                  <Picker.Item label="Meters" value="meters" />
                  <Picker.Item label="Square Meters" value="sqm" />
                </Picker>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.error }]}
                onPress={() => setShowMaterialModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={addMaterial}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Submit_bbutt
          text={loading ? "Creating..." : "Create Task"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  picker: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  peopleList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  personItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  personInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePlaceholderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  personName: {
    fontSize: 16,
    fontWeight: "600",
  },
  personEmail: {
    fontSize: 14,
  },
  personPhone: {
    fontSize: 14,
  },
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 16,
    fontWeight: "600",
  },
  materialQuantity: {
    fontSize: 14,
    marginTop: 4,
  },
  attachmentButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  attachmentButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    width: "48%",
    justifyContent: "center",
  },
  attachmentButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  attachmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  attachmentName: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 12,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  submitContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  selectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    width: "48%",
    justifyContent: "center",
  },
  selectButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  selectedPeopleContainer: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedLabel: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
  },
  selectedPersonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedPersonInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  selectedProfilePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedProfilePlaceholderText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedPersonName: {
    fontSize: 15,
    fontWeight: "600",
  },
  selectedPersonEmail: {
    fontSize: 13,
  },
  selectedPersonPhone: {
    fontSize: 13,
  },
  attachmentSubsection: {
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
});
