import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import UserProfile from "../componets/UserProfile";
import PostItem from "../componets/ PostItem";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useSelector } from "react-redux";

const PostsScreen = () => {
  const [serverPosts, setServerPosts] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    await db
      .firestore()
      .collection("posts")
      .onSnapshot((data) =>
        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
