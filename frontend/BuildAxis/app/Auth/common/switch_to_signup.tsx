
 import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity,Pressable } from 'react-native';
import { useRouter } from "expo-router";


const router = useRouter()
// switch between login and and signup screen
export const SwitchScreens=({text1,text2,path}:any)=>{
    return(
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                  <Text style={styles.smallText}>{text1}</Text>
                  <TouchableOpacity  onPress={() => router.push(path)}><Text style={styles.registerText}>{text2}</Text></TouchableOpacity>
              </View>

    )
}

const styles = StyleSheet.create({

  smallText: {
    color: '#666',
    fontSize: 14,
  },
  registerText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
      

});
