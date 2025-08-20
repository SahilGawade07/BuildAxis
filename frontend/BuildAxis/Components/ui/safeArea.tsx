import React from "react";
import {StatusBar,} from "react-native";
import { Colors } from "@/Thems/color";




//This is top company Bar
export function Safe_area() {
    return(
        <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
    )
}