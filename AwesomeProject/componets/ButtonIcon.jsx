import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const ButtonIcon = ({ icon, onPress, color, size }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Feather name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default ButtonIcon;
