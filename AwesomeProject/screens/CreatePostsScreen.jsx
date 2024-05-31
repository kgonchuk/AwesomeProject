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
import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraType } from "expo-camera/legacy";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { reverseGeocodeAsync } from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import ButtonIcon from "../componets/ButtonIcon";
import { useNavigation } from "@react-navigation/native";

const CreatePostsScreen = () => {
  const [hasCameraPermission, setHasCameraPermision] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [location, setLocation] = useState("");
  const [post, setPost] = useState(null);

  const cameraRef = useRef(null);
  const formikRef = useRef(null);

  const navigation = useNavigation();

  const reverseGeocode = async (coords) => {
    try {
      const location = await reverseGeocodeAsync(coords);
      if (location && location.length > 0) {
        const address =
          location[0].name || location[0].city || location[0].region;
        return address;
      } else {
        return "Местоположение не найдено";
      }
    } catch (error) {
      console.error("Ошибка геокодирования:", error);
      return "Ошибка геокодирования";
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermision(status === "granted");

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setLocation(coords);

        const locationAddress = await reverseGeocode(coords);
        setLocationName(locationAddress);
      } catch (error) {
        console.error("Ошибка получения местоположения:", error);
      }
    })();
  }, [locationName]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }
    })();
  }, []);

  const takePic = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();

        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert("Picture saved!");
        setImage(null);
      } catch (error) {
        console.log(error);
      }
    }
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
          setImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };
  const resetForm = () => {
    setName("");
    setLocation("");
    setImage(null);
  };
  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const removeImage = () => {
    setImage(null);
  };
  const handleForm = async () => {
    const id = Date.now();
    if (!name || !location || !image) {
      alert("Заповніть обов'язкове поле");
      return;
    }
    setPost({
      id,
      image,
      name,
    });
    console.log("Post:", post);
    resetForm();

    navigation.navigate("PostsScreen");
  };
  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        {!image ? (
          <Camera
            style={styles.camera}
            type={type}
            flashMode={flash}
            ref={cameraRef}
          >
            <View style={styles.cameraIcon}>
              {!image && !isLoading && (
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
            source={{ uri: image }}
            style={{
              flex: 1,
              width: "100%",
              height: 240,
              resizeMode: "contain",
            }}
          />
        )}
        <View style={[styles.iconTopOptions, image && { display: "none" }]}>
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
          {image && (
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
          {!image && (
            <TouchableOpacity onPress={uploadPhoto}>
              <Text style={styles.textPhoto}>Завантажте фото</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <TextInput
            placeholder="Назва..."
            placeholderTextColor={"#BDBDBD"}
            value={name}
            onChangeText={setName}
            required={true}
            style={styles.input}
          />
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Map")}
              style={styles.input}
            >
              <Text
                style={[styles.inputText, { paddingLeft: 25 }]}
                placeholder="Місцевість..."
                placeholderTextColor="#BDBDBD"
                value={locationName}
                onChangeText={setLocationName}
              ></Text>

              <Feather
                name="map-pin"
                style={styles.locationIcon}
                color="rgba(189, 189, 189, 1)"
                size={20}
              />
            </TouchableOpacity>
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

      {/* <Formik
        initialValues={{ postTitle: "", postLocation: "" }}
        onSubmit={(values) => console.log(values)}
        innerRef={formikRef}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
          resetForm,
        }) => (
          <View>
            <TextInput
              placeholder="Назва..."
              onChangeText={handleChange("postTitle")}
              onBlur={handleBlur("postTitle")}
              value={values.postTitle}
              style={styles.input}
            />
            <View style={styles.locationWrapper}>
              <View style={styles.locationGroup}>
                <TextInput
                  placeholder="Місцевість"
                  onChangeText={handleChange("postLocation")}
                  onBlur={handleBlur("postLocation")}
                  value={values.postLocation}
                  style={{ ...styles.input, ...styles.locationInput }}
                />
                <Feather
                  name="map-pin"
                  style={styles.locationIcon}
                  color="rgba(189, 189, 189, 1)"
                  size={20}
                />
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.btnPublish}
                onPress={handleSubmit}
              >
                <Text style={styles.btnText}>Опублікувати</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnDeletePost}>
              <TouchableOpacity onPress={resetForm} style={styles.deletePost}>
                <Feather
                  name="trash-2"
                  size="24"
                  color="rgba(189, 189, 189, 1)"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik> */}
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
    paddingTop: 20,
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
