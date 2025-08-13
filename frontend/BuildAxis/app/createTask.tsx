import React from 'react';
import { View, ImageBackground, StyleSheet, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

const App = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://picsum.photos/800/1200"}} // Use a valid image URL
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }} // Ensure image covers the area
      >
        <Text>hii</Text>
        <Text>hii</Text>
        <Text>hii</Text>
        <BlurView
          intensity={10} // Adjust intensity (0-100)
          tint="light" // Use 'light', 'default', or 'dark'
          style={styles.blur}
        >
          <Text style={styles.text}>Blurred Content</Text>
        </BlurView>
        <Text>hii</Text>
        <Text>hii</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  blur: { 
    position: 'absolute', // Use absolute positioning to overlay blur
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});

export default App;