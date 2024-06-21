import {
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import defaultAvatar from "../assets/img/User.png";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  async function fetchData() {
    onAuthStateChanged(auth, async (user) => {
      setName(user.displayName);
      setPhoto(user.photoURL);
      setUserEmail(user.email);
      setPhotoLocation(user.photoLocation);

      const q = query(
        collection(db, "usersPosts"),
        where("displayName", "==", user.displayName)
      );
      const querySnapshot = await getDocs(q);
      const newPosts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          photo: data.photoURL,
          description: data.description,
          photoLocation: data.photoLocation,
          id: data.id,
        };
      });

      setPosts(newPosts);
    });
  }
  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  return (
    // <View style={styles.container}>
    //   <View style={styles.account}>
    //     <Image source={{ uri: photo }} style={styles.img} />
    //     <View style={styles.userData}>
    //       <Text style={styles.textPrimary}>{name}</Text>
    //       <Text style={styles.textSecondary}>{userEmail}</Text>
    //     </View>
    //   </View>
    //   <ScrollView contentContainerStyle={styles.scrollContainer}>
    //     <SafeAreaView style={{ flex: 1 }}>
    //       <View style={styles.content}>
    //         {posts.map((post, index) => {
    //           return (
    //             <View style={styles.postContainer} key={index}>
    //               <View style={styles.postPhotoWrap}>
    //                 <Image
    //                   source={{ uri: post.photo }}
    //                   style={styles.postPhoto}
    //                 />
    //               </View>
    //               <Text style={styles.postTitle}>{post.description}</Text>
    //               <View style={styles.postDetails}>
    //                 <TouchableOpacity
    //                   style={styles.postComments}
    //                   onPress={() => navigation.navigate("Comments")}
    //                 >
    //                   <Feather
    //                     name="message-circle"
    //                     size={24}
    //                     style={styles.postIcon}
    //                   />
    //                   <Text style={styles.commentText}>12</Text>
    //                 </TouchableOpacity>

    //                 <TouchableOpacity
    //                   style={styles.postLocation}
    //                   onPress={() => navigation.navigate("Map")}
    //                 >
    //                   <Feather
    //                     name="map-pin"
    //                     size={24}
    //                     style={styles.locationIcon}
    //                   />
    //                   <Text style={styles.locationText}>photoLocation</Text>
    //                 </TouchableOpacity>
    //               </View>
    //             </View>
    //           );
    //         })}
    //       </View>
    //     </SafeAreaView>
    //   </ScrollView>
    // </View>

    <View style={styles.container}>
      <View style={styles.account}>
        <Image source={{ uri: photo }} style={styles.img} />
        <View style={styles.userData}>
          <Text style={styles.textPrimary}>{name}</Text>
          <Text style={styles.textSecondary}>{userEmail}</Text>
        </View>
      </View>

      <SafeAreaView style={styles.content}>
        <FlatList
          data={posts}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.FlatList}
          onEndReachedThreshold={0.5}
          keyExtractor={(item, indx) => indx.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 34 }}></View>}
          ListFooterComponent={() => <View style={{ height: 46 }}></View>}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <View style={styles.postPhotoWrap}>
                <Image source={{ uri: item.photo }} style={styles.postPhoto} />
              </View>
              <Text style={styles.postTitle}>{item.description}</Text>
              <View style={styles.postDetails}>
                <TouchableOpacity
                  style={styles.postComments}
                  onPress={() => navigation.navigate("Comments")}
                >
                  <Feather
                    name="message-circle"
                    size={24}
                    style={styles.postIcon}
                  />
                  <Text style={styles.commentText}>12</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.postLocation}
                  onPress={() => navigation.navigate("Map")}
                >
                  <Feather
                    name="map-pin"
                    size={24}
                    style={styles.locationIcon}
                  />
                  <Text style={styles.locationText}>{item.photoLocation}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginRight: 15,
    minHeight: Dimensions.get("window").height - 150,
  },
  account: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    gap: 8,
    // marginTop: 30,
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
  userData: { flexDirection: "column", justifyContent: "center" },
  postContainer: { marginBottom: 20, paddingHorizontal: 4 },
  postPhotoWrap: {
    width: "100%",
    height: 240,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
  },
  postPhoto: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  postTitle: {
    marginTop: 8,
    fontFamily: "Roboto-Medium",
    color: "#212121",
    fontSize: 16,
  },
  postDetails: {
    display: "flex",
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
  postComments: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
  },
  postLocation: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
  commentText: {
    fontFamily: "Roboto-Regular",
    color: "#BDBDBD",
    fontSize: 16,
  },
  locationText: {
    fontFamily: "Roboto-Regular",
    color: "#212121",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  postIcon: {
    color: "#FF6C00",
  },
  locationIcon: {
    color: "#BDBDBD",
  },
  FlatList: {
    display: "flex",
    width: "100%",
    gap: 8,
    marginTop: 32,
  },
});
export default UserProfile;
