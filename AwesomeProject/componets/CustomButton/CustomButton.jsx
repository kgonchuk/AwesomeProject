import { Text, StyleSheet, Pressable } from "react-native";
import React from "react";

const CustomButton = ({ onPress, text, type }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, styles[`container_${type}`]]}
    >
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    paddingTop: 16,
    paddingRight: 32,
    paddingBottom: 16,
    paddingRight: 32,
  },
  container_PRIMARY: {
    backgroundColor: "#FF6C00",
  },
  container_TERTTIARY: {},
  text: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    lineHeight: 18.75,
  },
  text_TERTTIARY: {
    color: "#1B4371",
  },
});

export default CustomButton;
