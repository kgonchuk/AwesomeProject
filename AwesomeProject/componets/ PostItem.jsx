// import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// import React from "react";
// import { useNavigation } from "@react-navigation/native";

// export default function PostItem({
//   id,
//   title,
//   photoLocation,
//   url,
//   geoLocation,
// }) {
//   const navigation = useNavigation();

//   const name = useSelector((state) => state.auth.name);
//   const userId = useSelector((state) => state.auth.userId);
//   const avatar = useSelector((state) => state.auth.avatar);
//   const [allComments, setAllComments] = useState([]);

//   const [userPutLike, setUserPutLike] = useState(false);

//   useEffect(() => {
//     const commentsRef = collection(db, "posts", id, "comments");
//     onSnapshot(commentsRef, (data) => {
//       const dbComments = data.docs.map((doc) => ({
//         commentId: doc.id,
//         ...doc.data(),
//       }));
//       setAllComments(dbComments);
//     });
//   }, []);
//   useEffect(() => {
//     const likesRef = collection(db, "posts", id, "likes");
//     onSnapshot(likesRef, (data) => {
//       const dbLikes = data.docs.map((doc) => ({
//         likeId: doc.id,
//         ...doc.data(),
//       }));
//       const didUserPutLike = dbLikes.some((dbLike) => dbLike.likeId === userId);
//       setUserPutLike(didUserPutLike);
//       setAllLikes(dbLikes);
//     });
//   }, []);

//   return (
//     <View style={styles.postContainer}>
//       <View style={styles.postPhotoWrap}>
//         <Image source={{ uri: url }} style={styles.postPhoto} alt={title} />
//       </View>
//       <Text style={styles.postTitle}>{title}</Text>
//       <View style={styles.postDetails}>
//         <TouchableOpacity
//           style={styles.postComments}
//           onPress={() => navigation.navigate("Comments", { url, id })}
//         >
//           <Feather name="message-circle" size={24} style={styles.postIcon} />
//           <Text style={styles.commentText}>{allComments.length}</Text>
//         </TouchableOpacity>
//         <View style={{ ...styles.postComments, marginLeft: 24 }}>
//           <Feather
//             name="thumbs-up"
//             size={24}
//             color={!userPutLike ? "#BDBDBD" : "#FF6C00"}
//             onPress={handleLikes}
//           />
//           <Text style={styles.commentText}>{allLikes.length}</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.postLocation}
//           onPress={() =>
//             navigation.navigate("Map", { geoLocation, photoLocation })
//           }
//         >
//           <Feather name="map-pin" size={24} style={styles.locationIcon} />
//           <Text style={styles.locationText}>{photoLocation}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: { marginLeft: 15, marginRight: 15 },
//   account: {
//     display: "flex",
//     flexDirection: "row",
//     // justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//     gap: 8,
//     // marginTop: 30,
//   },

//   textPrimary: {
//     fontSize: 13,
//     fontFamily: "Roboto-Bold",
//     fontWeight: 700,
//     lineHeight: 15.23,
//     color: "rgba(33, 33, 33, 1)",
//   },
//   textSecondary: {
//     fontSize: 11,
//     fontFamily: "Roboto-Regular",
//     fontWeight: 400,
//     lineHeight: 12.89,
//     color: "rgba(33, 33, 33, 1)",
//   },
//   img: {
//     width: 60,
//     height: 60,
//     borderRadius: 16,
//   },
//   userData: { flexDirection: "column", justifyContent: "center" },
//   scrollContainer: { flexGrow: 3 },
//   postPhotoWrap: {
//     width: "100%",
//     height: 240,
//     backgroundColor: "#F6F6F6",
//     borderRadius: 8,
//   },
//   postPhoto: {
//     width: "100%",
//     height: 240,
//     borderRadius: 8,
//   },
//   postTitle: {
//     marginTop: 8,
//     fontFamily: "Roboto-Medium",
//     color: "#212121",
//     fontSize: 16,
//   },
//   postDetails: {
//     display: "flex",
//     flexDirection: "row",
//     marginTop: 8,
//     justifyContent: "space-between",
//   },
//   postComments: {
//     display: "flex",
//     flexDirection: "row",
//     gap: 6,
//   },
//   postLocation: {
//     marginLeft: "auto",
//     display: "flex",
//     flexDirection: "row",
//     gap: 4,
//   },
//   commentText: {
//     fontFamily: "Roboto-Regular",
//     color: "#BDBDBD",
//     fontSize: 16,
//   },
//   locationText: {
//     fontFamily: "Roboto-Regular",
//     color: "#212121",
//     fontSize: 16,
//     textDecorationLine: "underline",
//   },
//   postIcon: {
//     color: "#FF6C00",
//   },
//   locationIcon: {
//     color: "#BDBDBD",
//   },
// });
