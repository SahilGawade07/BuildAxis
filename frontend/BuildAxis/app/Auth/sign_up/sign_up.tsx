import React, { useState ,useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

import { useRouter } from "expo-router";
const router = useRouter()

import {TextHeaderTop} from "../common/login_header"
import {TextInputs} from "../common/input_textbox"
import {PasswordTextInputs} from "../common/input_pass_textbox"
import {TextHeaderSecondTop} from "../common/second_top_header"
import {Continue} from "../common/continue_button"
import {Signup_with} from "../common/Signup_with"
import { SwitchScreens } from '../common/switch_to_signup';

export default function LoginScreen() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [secureText, setSecureText] = useState(true);
    const [continuebut, setContinueBut] = useState(true);
    const [err, setError] = useState<string>("");
    useEffect(() => {

        setError('');
        setContinueBut(true)
        // Validation
        if (!email || !password) {
           
            return 
        }
        if (!email.includes('@') || !email.includes('.')) {
            return 
        }
        if (password.length < 6) {
            return 
        }

        setContinueBut(false)
    }, [email, password]);


    const handleSignup = () => {
        setError('');
     

        // Validation
        if (!email || !password) {
            setError('All fields are required');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            setError('Invalid email address');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

  
        handleSubmit();
    };

    const handleSubmit = async () => {

        router.push("/Auth/create_org/create_org")
    };

    return (
        <View style={styles.container}>
            {/* Top Header */}
            <TextHeaderTop text="Sign up" />

            {/* Subheader */}
            <TextHeaderSecondTop text="Let’s get you started on your journey! Please fill out the form below to create your account" />
         {/* name Input */}
            <TextInputs
                value={email}
                onChangeText={setEmail}
                placeholder="Siddharth Chemte"
                keyboardType="default"
                textname="Name "
            />
            {/* Email Input */}
            <TextInputs
                value={email}
                onChangeText={setEmail}
                placeholder="abc@gmail.com"
                keyboardType="email-address"
                textname="Email"
            />

            {/* Password Input */}
            <PasswordTextInputs
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                keyboardType="default"
                textname="Password"
            />
                        {/* Password Input */}
            <PasswordTextInputs
                value={password}
                onChangeText={setPassword}
                placeholder="Password Verifications"
                keyboardType="default"
                textname="Password Verifications"
            />


            {/* Error Text */}
            <Text style={styles.error}>{err}</Text>

            {/* Continue Button */}
           <Continue text={"Sign Up"} touchable={continuebut} onPresss={handleSignup} />




            <SwitchScreens
                text1="Already have an account?"
                text2=" Log in"
                path="/Auth/create_org/create_org"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        marginTop: 25,
        backgroundColor: '#fff',
    },
    forgotText: {
        alignSelf: 'flex-end',
        marginTop: 8,
        color: '#999',
        fontSize: 14,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 12,
        color: '#999',
        fontSize: 14,
    },
    error: {
        color: 'red',
        marginTop: 8,
        fontSize: 14,
    },
});