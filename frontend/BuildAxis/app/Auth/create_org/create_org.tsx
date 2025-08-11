import React, { useState } from "react";
import {View,Text,Image,StyleSheet,TouchableOpacity,ImageBackground,ScrollView,} from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TextInputs } from "../common/input_textbox";
import Colors from "@/Thems/color";
import { useRouter } from "expo-router"; 

export default function AddOrganizationScreen() {
    const router = useRouter(); 

    // Form states
    const [orgName, setOrgName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // Form submit handler
    const handleAddOrganization = () => {
        // Simple validation
        if (!orgName || !email || !phone || !address) {
            alert("Please fill all fields");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            alert("Invalid email address");
            return;
        }
        // You could send data to backend here
        alert("Organization added successfully!");
        router.push("/tabs/Profile/profile");
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Top colored strip */}
            <View style={{ height: 30, backgroundColor: Colors.primary }} />

            {/* Header Image with logo */}
            <View style={styles.headerWrapper}>
                <ImageBackground
                    source={require("@/assets/images/Construction.png")}
                    style={styles.headerImage}
                >
                    {/* Logo Container */}
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require("@/assets/images/logo.jpg")}
                            style={styles.logo}
                        />
                        {/* Add icon */}
                        <View style={styles.plusIcon}>
                            <FontAwesome6 name="add" size={15} color="black" />
                        </View>
                    </View>
                </ImageBackground>
            </View>

            {/* Input fields */}
            <View style={styles.formSection}>
                <TextInputs
                    value={orgName}
                    onChangeText={setOrgName}
                    placeholder="Enter The Organization Name"
                    keyboardType="default"
                    textname="Organization Name"
                />
                <TextInputs
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter the Email"
                    keyboardType="email-address"
                    textname="Email"
                />
                <TextInputs
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter the Phone Number"
                    keyboardType="phone-pad"
                    textname="Phone No."
                />
                <TextInputs
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter the Address"
                    keyboardType="default"
                    textname="Address"
                />
            </View>

            {/* Submit button */}
            <TouchableOpacity style={styles.button} onPress={handleAddOrganization}>
                <Text style={styles.buttonText}>Add to Organization</Text>
            </TouchableOpacity>

            {/* Skip button */}
            <TouchableOpacity
                style={[styles.button, { width: "20%", alignSelf: "flex-end" }]}
                onPress={() => router.push("/tabs/Profile/profile")}
            >
                <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    headerWrapper: {
        height: "35%",
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        overflow: "hidden",
    },
    headerImage: {
        width: "100%",
        height: 250,
    },
    logoWrapper: {
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 4,
        position: "absolute",
        bottom: -60,
        left: 30,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6, // Android shadow
        shadowColor: Colors.primary, // iOS shadow
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 60,
        resizeMode: "contain",
    },
    plusIcon: {
        position: "absolute",
        bottom: 1,
        right: 1,
        backgroundColor: "#fff",
        borderRadius: 15,
        height: 30,
        width: 30,
        borderWidth: 2,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },
    formSection: {
        padding: 15,
        marginTop: 0,
    },
    button: {
        backgroundColor: "#0057FF",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        margin: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
