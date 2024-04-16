import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import avatar from "../assets/img/User.png";

const UserProfile = () => {
  return (
    <View style={styles.container}>
      <Image source={avatar} style={styles.img} />
      <View>
        <Text style={styles.textPrimary}>User name</Text>
        <Text style={styles.textSecondary}>User mail</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
    marginLeft: 18,
  },

  textPrimary: {
    fontSize: 13,
    fontFamily: "Roboto-Bold",
    fontWeight: 700,
    lineHeight: 15.23,
    color: "rgba(33, 33, 33, 1)",
  },
  textSecondary: {
    fontSize: 11,
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    lineHeight: 12.89,
    color: "rgba(33, 33, 33, 1)",
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
});
export default UserProfile;
