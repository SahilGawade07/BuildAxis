 import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity,Pressable } from 'react-native';

// Password text box
export const PasswordTextInputs=({ value, onChangeText, placeholder ,keyboardType ,textname}:any)=>{
      const [secureText, setSecureText] = useState(true);
    return(
      <>
       <Text style={styles.name}>{textname}</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder={placeholder}
                    style={[ { flex: 1 }]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureText}

                />
                <Pressable onPress={() => setSecureText(!secureText)}>
                    <Ionicons
                        name={secureText ? 'eye-off' : 'eye'}
                        size={24}
                        color="#999"
                    />
                </Pressable> 
            </View>
            </>
    )
}

const styles = StyleSheet.create({

  name:{
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
        marginTop: 16,
  },

 passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },

});