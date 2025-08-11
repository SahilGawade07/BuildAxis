import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Safe_area } from "@/components/Common/safe_area";

const profile = () => {
  return (
    <>
      <Safe_area />
      <Text>Profile</Text>
    </>
  );
};

export default profile;

const styles = StyleSheet.create({});
