import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase/config";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { Camera, CameraType } from "expo-camera/legacy";
import ButtonIcon from "../componets/ButtonIcon";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";

const CreatePostsScreen = () => {
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [postPhoto, setPostPhoto] = useState("");
  const [uid, setUid] = useState("");
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [geoLocation, setGeoLocation] = useState("");
  const [photoLocation, setPhotoLocation] = useState("");
  const [post, setPost] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setPermission(status === "granted");
    })();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setGeoLocation(coords);
    })();
  }, []);

  const takePic = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();

        setPostPhoto(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setDescription("");
    setPhotoLocation("");
    setPostPhoto(null);
  };

  const uploadPhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
          setPostPhoto(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const saveImage = async () => {
    if (postPhoto) {
      try {
        await MediaLibrary.createAssetAsync(postPhoto);
        alert("Picture saved!");
        setPostPhoto(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeImage = () => {
    setPostPhoto(null);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setDisplayName(user.displayName);
      setPhotoURL(user.photoURL);
      setUid(user.uid);
      setEmail(user.email);
      await getData(user.displayName);
    });
  }, []);

  async function getData(name) {
    const q = query(collection(db, "users"), where("displayName", "==", name));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(data);
    });
  }

  const handleForm = async () => {
    console.log(
      `Photo: ${postPhoto}, Description: ${description}, Location:${photoLocation}`
    );

    setLoading(true);
    if (!postPhoto || !description) {
      alert("Заповніть обов'язкове поле");
      return;
    }
    try {
      const response = await fetch(postPhoto);

      const blob = await response.blob();

      const date = new Date();

      const storageRef = ref(storage, `${displayName} ${date}`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const proress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Progress", proress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await setDoc(doc(db, "usersPosts", `${displayName} ${date}`), {
              displayName,
              photoURL: downloadURL,
              description,
              photoLocation,
              geoLocation,
              id: `${displayName} ${date}`,
            });
          });
        }
      );
    } catch (error) {
      console.log(error);
    }

    resetForm();
    navigation.navigate("PostsScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        {!postPhoto ? (
          <Camera
            style={styles.camera}
            type={type}
            flashMode={flash}
            ref={cameraRef}
          >
            <View style={styles.cameraIcon}>
              {!postPhoto && !isLoading && (
                <ButtonIcon
                  size="28"
                  icon="camera"
                  onPress={takePic}
                  style={styles.photoIcon}
                />
              )}
            </View>
          </Camera>
        ) : (
          <Image
            source={{ uri: postPhoto }}
            style={{
              flex: 1,
              width: "100%",
              height: 240,
              resizeMode: "contain",
            }}
          />
        )}
        <View style={[styles.iconTopOptions, postPhoto && { display: "none" }]}>
          <ButtonIcon
            icon="repeat"
            size="18"
            color={type === CameraType.front ? "blue" : "black"}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          />
        </View>
      </View>
      <View style={styles.photoThumb}>
        <View style={styles.textIcon}>
          {postPhoto && (
            <View style={styles.editContainer}>
              <TouchableOpacity
                onPress={() => removeImage(null)}
                style={styles.editPhoto}
              >
                <Text style={styles.textPhoto}>Редагувати фото</Text>
                <Feather
                  name="x-circle"
                  size={28}
                  color="rgba(189, 189, 189, 1)"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={saveImage} style={styles.editPhoto}>
                <Text style={styles.textPhoto}>Зберегти фото</Text>
                <Feather name="save" size={28} color="rgba(189, 189, 189, 1)" />
              </TouchableOpacity>
            </View>
          )}
          {!postPhoto && (
            <TouchableOpacity onPress={uploadPhoto}>
              <Text style={styles.textPhoto}>Завантажте фото</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <TextInput
            placeholder="Назва..."
            placeholderTextColor={"#BDBDBD"}
            value={description}
            onChangeText={setDescription}
            required={true}
            style={styles.input}
          />
          <View>
            <TextInput
              style={[styles.inputText, { paddingLeft: 25 }]}
              placeholder="Місцевість..."
              placeholderTextColor="#BDBDBD"
              type="text"
              value={photoLocation}
              onChangeText={setPhotoLocation}
            ></TextInput>

            <Feather
              name="map-pin"
              style={styles.locationIcon}
              color="rgba(189, 189, 189, 1)"
              size={20}
            />
          </View>
          <TouchableOpacity style={styles.btnPublish} onPress={handleForm}>
            <Text style={styles.btnText}>Опубліковати</Text>
          </TouchableOpacity>
          <View style={styles.trashBtnContainer}>
            <TouchableOpacity style={styles.deletePost} onPress={resetForm}>
              <Feather
                name="trash-2"
                size="24"
                color="rgba(189, 189, 189, 1)"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
  },
  photoContainer: {
    width: 343,
    height: 240,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
    marginTop: 32,
  },

  camera: {
    height: 240,
    borderRadius: 8,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.30)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    position: "absolute",
    top: 80,
    left: 130,
  },
  textIcon: { textAlign: "center" },
  textPhoto: {
    color: "rgba(189, 189, 189, 1)",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#BDBDBD",
    marginBottom: 32,
  },
  iconTopOptions: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 99,
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.30)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  editPhoto: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  editContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },

  input: {
    width: 343,
    paddingBottom: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(232, 232, 232, 1)",
  },
  inputText: {
    width: 343,
    paddingBottom: 16,
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(232, 232, 232, 1)",
  },
  locationInput: {
    paddingLeft: 25,
  },
  locationIcon: {
    width: 24,
    position: "absolute",
    bottom: 15,
  },
  locationGroup: {
    position: "relative",
    justifyContent: "center",
    marginBottom: 32,
  },
  locationWrapper: {
    paddingVertical: 32,
    gap: 16,
  },
  btnPublish: {
    backgroundColor: "rgba(255, 108, 0, 1)",
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 120,
    paddingRight: 120,
    borderRadius: 100,
    marginTop: 32,
  },
  btnText: {
    color: "rgba(255, 255, 255, 1)",
  },

  deletePost: {
    backgroundColor: "rgba(246, 246, 246, 1)",
    width: 70,
    height: 40,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 23,
    paddingRight: 23,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },
  trashBtnContainer: { marginTop: 20, alignItems: "center" },
});
export default CreatePostsScreen;

// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
// } from "react-native";
// import {
//   collection,
//   getDocs,
//   doc,
//   query,
//   where,
//   setDoc,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { auth, db, storage } from "../firebase/config";
// import * as ImagePicker from "expo-image-picker";
// import * as MediaLibrary from "expo-media-library";
// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { Camera, CameraType } from "expo-camera/legacy";
// import ButtonIcon from "../componets/ButtonIcon";
// import { Feather } from "@expo/vector-icons";
// import * as Location from "expo-location";
// import { useNavigation } from "@react-navigation/native";

// const CreatePostsScreen = () => {
//   const navigation = useNavigation();
//   const name = useSelector((state) => state.auth.name);
//   const userId = useSelector((state) => state.auth.userId);

//   const [photo, setPhoto] = useState("");
//   const [title, setTitle] = useState("");
//   const [photoLocation, setPhotoLocation] = useState("");
//   const [geoLocation, setGeoLocation] = useState("");

//   const [hasPermission, setHasPermission] = useState(null);
//   const [cameraRef, setCameraRef] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);
//   const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
//   const [isFocused, setIsFocused] = useState(null);
//   const [isLoading, setLoading] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       await MediaLibrary.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();

//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission to access location was denied");
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       const coords = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       };
//       setGeoLocation(coords);
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   const takePic = async () => {
//     if (cameraRef) {
//       const { uri } = await cameraRef.takePictureAsync();
//       setPhoto(uri);
//     }
//   };

//   const resetForm = () => {
//     setPhoto("");
//     setTitle("");
//     setPhotoLocation("");
//   };

//   const handleForm = async () => {
//     try {
//       const photo = await uploadPhotoToServer();
//       await addDoc(collection(db, "posts"), {
//         photo,
//         title,
//         photoLocation,
//         geoLocation,
//         owner: { userId, name },
//         createdAt: new Date().getTime(),
//       });
//     } catch (error) {
//       console.log("error", error.message);
//       throw error;
//     } finally {
//       resetForm();
//       navigation.navigate("PostsScreen");
//     }
//   };

//   const uploadPhotoToServer = async () => {
//     const uniqPostId = Date.now().toString();
//     try {
//       const response = await fetch(photo);
//       const file = await response.blob();
//       const imageRef = ref(storage, `postImage/${uniqPostId}`);
//       await uploadBytes(imageRef, file);

//       const processedPhoto = await getDownloadURL(imageRef);
//       return processedPhoto;
//     } catch (error) {
//       console.log("error", error.message);
//     }
//   };

//   const saveImage = async () => {
//     try {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status === "granted") {
//         const result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           allowsEditing: true,
//           aspect: [4, 3],
//           quality: 1,
//         });
//         if (!result.canceled) {
//           setPhoto(result.assets[0].uri);
//         }
//       }
//     } catch (error) {
//       console.log("error", error.message);
//     }
//   };

//   const uploadPhoto = async () => {
//     try {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status === "granted") {
//         const result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           allowsEditing: true,
//           aspect: [4, 3],
//           quality: 1,
//         });
//         if (!result.canceled) {
//           setPhoto(result.assets[0].uri);
//         }
//       }
//     } catch (error) {
//       console.log("error", error.message);
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.photoContainer}>
//         {!photo ? (
//           <Camera
//             style={styles.camera}
//             type={type}
//             flashMode={flash}
//             ref={cameraRef}
//           >
//             <View style={styles.cameraIcon}>
//               {!photo && !isLoading && (
//                 <ButtonIcon
//                   size="28"
//                   icon="camera"
//                   onPress={takePic}
//                   style={styles.photoIcon}
//                 />
//               )}
//             </View>
//           </Camera>
//         ) : (
//           <Image
//             source={{ uri: photo }}
//             style={{
//               flex: 1,
//               width: "100%",
//               height: 240,
//               resizeMode: "contain",
//             }}
//           />
//         )}
//         <View style={[styles.iconTopOptions, photo && { display: "none" }]}>
//           <ButtonIcon
//             icon="repeat"
//             size="18"
//             color={type === CameraType.front ? "blue" : "black"}
//             onPress={() => {
//               setType(
//                 type === Camera.Constants.Type.back
//                   ? Camera.Constants.Type.front
//                   : Camera.Constants.Type.back
//               );
//             }}
//           />
//         </View>
//       </View>
//       <View style={styles.photoThumb}>
//         <View style={styles.textIcon}>
//           {photo && (
//             <View style={styles.editContainer}>
//               <TouchableOpacity
//                 onPress={() => removeImage(null)}
//                 style={styles.editPhoto}
//               >
//                 <Text style={styles.textPhoto}>Редагувати фото</Text>
//                 <Feather
//                   name="x-circle"
//                   size={28}
//                   color="rgba(189, 189, 189, 1)"
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={saveImage} style={styles.editPhoto}>
//                 <Text style={styles.textPhoto}>Зберегти фото</Text>
//                 <Feather name="save" size={28} color="rgba(189, 189, 189, 1)" />
//               </TouchableOpacity>
//             </View>
//           )}
//           {!photo && (
//             <TouchableOpacity onPress={uploadPhoto}>
//               <Text style={styles.textPhoto}>Завантажте фото</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <View>
//           <TextInput
//             placeholder="Назва..."
//             placeholderTextColor={"#BDBDBD"}
//             value={title}
//             onChangeText={(value) => setTitle(value)}
//             required={true}
//             style={styles.input}
//           />
//           <View>
//             <TextInput
//               style={[styles.inputText, { paddingLeft: 25 }]}
//               placeholder="Місцевість..."
//               placeholderTextColor="#BDBDBD"
//               value={photoLocation}
//               onChangeText={(value) => setPhotoLocation(value)}
//             ></TextInput>

//             <Feather
//               name="map-pin"
//               style={styles.locationIcon}
//               color="rgba(189, 189, 189, 1)"
//               size={20}
//             />
//           </View>
//           <TouchableOpacity style={styles.btnPublish} onPress={handleForm}>
//             <Text style={styles.btnText}>Опубліковати</Text>
//           </TouchableOpacity>
//           <View style={styles.trashBtnContainer}>
//             <TouchableOpacity style={styles.deletePost} onPress={resetForm}>
//               <Feather
//                 name="trash-2"
//                 size="24"
//                 color="rgba(189, 189, 189, 1)"
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     display: "flex",
//     alignItems: "center",
//   },
//   photoContainer: {
//     width: 343,
//     height: 240,
//     backgroundColor: "#F6F6F6",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 8,
//     overflow: "hidden",
//     marginTop: 32,
//   },

//   camera: {
//     height: 240,
//     borderRadius: 8,
//     width: "100%",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraIcon: {
//     width: 60,
//     height: 60,
//     backgroundColor: "rgba(255, 255, 255, 0.30)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 100,
//     position: "absolute",
//     top: 80,
//     left: 130,
//   },
//   textIcon: { textAlign: "center" },
//   textPhoto: {
//     color: "rgba(189, 189, 189, 1)",
//     fontFamily: "Roboto-Regular",
//     fontSize: 16,
//     color: "#BDBDBD",
//     marginBottom: 32,
//   },
//   iconTopOptions: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     zIndex: 99,
//     paddingHorizontal: 5,
//     paddingVertical: 5,
//     width: 40,
//     height: 40,
//     backgroundColor: "rgba(255, 255, 255, 0.30)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 100,
//   },
//   editPhoto: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 5,
//   },
//   editContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: 25,
//   },

//   input: {
//     width: 343,
//     paddingBottom: 16,
//     paddingTop: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(232, 232, 232, 1)",
//   },
//   inputText: {
//     width: 343,
//     paddingBottom: 16,
//     paddingTop: 32,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(232, 232, 232, 1)",
//   },
//   locationInput: {
//     paddingLeft: 25,
//   },
//   locationIcon: {
//     width: 24,
//     position: "absolute",
//     bottom: 15,
//   },
//   locationGroup: {
//     position: "relative",
//     justifyContent: "center",
//     marginBottom: 32,
//   },
//   locationWrapper: {
//     paddingVertical: 32,
//     gap: 16,
//   },
//   btnPublish: {
//     backgroundColor: "rgba(255, 108, 0, 1)",
//     paddingTop: 16,
//     paddingBottom: 16,
//     paddingLeft: 120,
//     paddingRight: 120,
//     borderRadius: 100,
//     marginTop: 32,
//   },
//   btnText: {
//     color: "rgba(255, 255, 255, 1)",
//   },

//   deletePost: {
//     backgroundColor: "rgba(246, 246, 246, 1)",
//     width: 70,
//     height: 40,
//     paddingTop: 8,
//     paddingBottom: 8,
//     paddingLeft: 23,
//     paddingRight: 23,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 120,
//   },
//   trashBtnContainer: { marginTop: 20, alignItems: "center" },
// });
// export default CreatePostsScreen;
