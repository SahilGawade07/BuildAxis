 import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity,Pressable } from 'react-native';
//Logo of login
export const Logo=({name,text,isSelected}:any)=>{
    return(
            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name={name} size={20} color="#000" />
                <Text style={styles.socialText}>{text}</Text>
            </TouchableOpacity>


    )
}

//Logo of login
export const Signup_with=({name,text,isSelected}:any)=>{
    return(
            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name={name} size={20} color="#000" />
                <Text style={styles.socialText}>{text}</Text>
            </TouchableOpacity>


    )
}

const styles = StyleSheet.create({

        socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        paddingHorizontal: 20,
        marginVertical: 8,
    },
    socialText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
       

});