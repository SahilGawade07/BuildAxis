
 import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity,Pressable } from 'react-native';
//continue button
export const Continue=({text,touchable ,onPresss  }:any)=>{
    return(
    <TouchableOpacity style={[styles.continue , touchable?{backgroundColor: '#f9f9f9',}:{backgroundColor: '#007AFF'}]} disabled={false}  onPress={()=>{onPresss()}}>
       <Text style={[styles.forwordbutt, touchable?{color: '#999',}:{color: '#ffffffff'}]}> {text}</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

  continue:{
    backgroundColor: '#e0e0e0',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginVertical:10,
  },
forwordbutt:{
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',


},
 

});

export default Continue;