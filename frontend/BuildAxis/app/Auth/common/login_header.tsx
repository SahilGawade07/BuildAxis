import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity,Pressable } from 'react-native';


//header top
export const TextHeaderTop=({text}:any)=>{
    return(
    <Text style={styles.header}>{text}</Text>)
}


const styles = StyleSheet.create({

  header:{
    fontSize:40,
    fontWeight:"bold"
  }

});

export default TextHeaderTop;