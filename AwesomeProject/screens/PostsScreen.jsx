import { View, Text, StyleSheet } from "react-native";
import React from "react";
import UserProfile from "../componets/UserProfile";

const PostsScreen = () => {
  return (
    <View style={styles.container}>
      <UserProfile />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
});
export default PostsScreen;
