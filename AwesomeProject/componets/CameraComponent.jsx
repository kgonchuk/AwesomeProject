// import React, { useState, useEffect, useRef } from "react";
// import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
// import { Camera, CameraType } from "expo-camera";
// import { Feather } from "@expo/vector-icons";
// import * as MediaLibrary from "expo-media-library";

// const CameraComponent = ({ setSelectedImage, image }) => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [cameraRef, setCameraRef] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);
//   const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
//   const [isIconShown, setIsIconShown] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         MediaLibrary.requestPermissionsAsync();
//         const cameraRermission = await Camera.requestCameraPermissionsAsync();
//         setHasPermission(cameraRermission.status === "granted");
//       } catch (error) {
//         console.error("Permission to access media library not granted", error);
//       }
//     })();
//   }, []);

//   const takePic = async () => {
//     if (cameraRef) {
//       try {
//         setIsLoading(true);
//         const newPhoto = await cameraRef.current.takePictureAsync({
//           quality: 0.3,
//           basr64: true,
//           exif: false,
//         });
//         setSelectedImage(newPhoto.uri);
//         setIsIconShown(true);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const savePhoto = async () => {
//     if (image) {
//       try {
//         await MediaLibrary.createAssetAsync(image);
//         setIsIconShown(false);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   const deletImage = () => {
//     setIsIconShown(false);
//     setSelectedImage(null);
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       {!image && (
//         <Camera
//           type={type}
//           flashMode={flash}
//           ref={cameraRef}
//           aspectRatio={1 / 1}
//           style={{
//             height: 240,
//           }}
//         />
//       )}
//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       <View>
//         <TouchableOpacity
//           style={styles.flipContainer}
//           color={type === CameraType.front ? colors.activeColor : "#fff"}
//           onPress={() => {
//             setType(
//               type === Camera.Constants.Type.back
//                 ? Camera.Constants.Type.front
//                 : Camera.Constants.Type.back
//             );
//           }}
//         >
//           <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
//             {" "}
//             Flip{" "}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.flipContainer}
//           color={
//             flash === Camera.Constants.FlashMode.on
//               ? colors.activeColor
//               : "#fff"
//           }
//           onPress={() => {
//             setFlash(
//               flash === Camera.Constants.FlashMode.off
//                 ? Camera.Constants.FlashMode.on
//                 : Camera.Constants.FlashMode.off
//             );
//           }}
//         ></TouchableOpacity>
//         <View style={styles.takePhotoWrapper}>
//           <View style={styles.photoOptionsWrapper}>
//             {image && (
//               <TouchableOpacity
//                 onPress={() => deletImage(null)}
//                 style={styles.photoIcon}
//               >
//                 <Feather name="x-circle" size="24" color="red" />
//               </TouchableOpacity>
//             )}
//             {image && isIconShown && (
//               <TouchableOpacity
//                 onPress={savePhoto}
//                 style={[styles.photoIcon, !isIconShown && { display: "none" }]}
//               >
//                 <Feather name="save" size="24" color="red" />
//               </TouchableOpacity>
//             )}
//           </View>
//           {!image && !isLoading && (
//             <TouchableOpacity onPress={takePic} style={styles.photoIcon}>
//               <Feather name="camera" size="24" color="red" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: "center" },
//   image: {
//     flex: 1,
//     width: "100%",
//     height: 240,
//     resizeMode: "contain",
//   },
//   takePhotoWrapper: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 98,
//   },
//   photoOptionsWrapper: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     gap: 15,
//   },
//   photoIcon: {
//     width: 60,
//     height: 60,
//     backgroundColor: "rgba(255, 255, 255, 0.30)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 100,
//   },
//   camera: { flex: 1 },
//   photoView: {
//     flex: 1,
//     backgroundColor: "transparent",
//     justifyContent: "flex-end",
//   },

//   flipContainer: {
//     flex: 0.1,
//     alignSelf: "flex-end",
//   },

//   button: { alignSelf: "center" },

//   takePhotoOut: {
//     borderWidth: 2,
//     borderColor: "white",
//     height: 50,
//     width: 50,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 50,
//   },

//   takePhotoInner: {
//     borderWidth: 2,
//     borderColor: "white",
//     height: 40,
//     width: 40,
//     backgroundColor: "white",
//     borderRadius: 50,
//   },
// });
// export default CameraComponent;

// import { View, Text, StyleSheet } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import { Camera, CameraType } from "expo-camera";
// import * as MediaLibrary from "expo-media-library";

// const CameraComponent = () => {
//   const [hasCameraPermission, setHasCameraPermision] = useState(null);
//   const [image, setImage] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);
//   const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     (async () => {
//       MediaLibrary.requestPermissionsAsync();
//       const cameraStatus = await Camera.requestCameraPermissionsAsync();
//       setHasCameraPermision(cameraStatus.status === "granted");
//     })();
//   }, []);
//   return (
//     <View style={styles.container}>
//       <Text>CameraComponent</Text>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "white",
//   },
// });

// export default CameraComponent;
