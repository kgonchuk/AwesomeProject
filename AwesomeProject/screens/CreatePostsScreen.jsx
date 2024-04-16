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
import { Formik } from "formik";
import { Feather } from "@expo/vector-icons";
import CameraComponent from "../componets/CameraComponent";

const CreatePostsScreen = () => {
  const formikRef = useRef(null);
  const [image, setImage] = useState(null);
  const setSelectedImage = (img) => {
    setImage(img);
    formikRef.current.setFieldValue("image", img);
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <CameraComponent setSelectedImage={setSelectedImage} image={image} />
      </View>
      <View style={styles.cameraWrapp}></View>
      <Formik
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
      </Formik>
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(232, 232, 232, 1)",
    marginTop: 32,
    marginBottom: 20,
    backgroundColor: "rgba(232, 232, 232, 1)",
  },
  input: {
    width: 343,
    paddingBottom: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(232, 232, 232, 1)",
    marginTop: 32,
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
  },
  btnText: {
    color: "rgba(255, 255, 255, 1)",
  },
  btnDeletePost: {
    flex: 1,
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
    marginTop: 50,
  },
});
export default CreatePostsScreen;
