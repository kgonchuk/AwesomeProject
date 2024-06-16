import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import bg from "../assets/img/Photo BG.jpg";

import CustomButton from "../componets/CustomButton";
import { useNavigation } from "@react-navigation/native";

import plus from "../assets/img/add.png";
import KeyboardAvoidingContainer from "../componets/KeyboardAvoidingContainer";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import { auth } from "../firebase/config";
import { storage } from "../firebase/config";
import * as ImagePicker from "expo-image-picker";

const RegistrationScreen = () => {
  const [displayName, setDisplayName] = useState("");
  const [img, setImg] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginFocused, setLoginFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showPassText, setShowPassText] = useState("Показати");
  const [permission, setPermission] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!displayName && !email && !password) {
      return Alert.alert("Помилка", "Заповніть форму цілком");
    }

    if (!isEmailValid) {
      return Alert.alert(
        "Помилка",
        "Введіть коректну адресу електронної пошти"
      );
    }

    if (password.length < 6) {
      return Alert.alert("Помилка", "Пароль меє містити від 6ти символів");
    }

    console.log(
      ` Login: "${displayName}"; Email: "${email}"; Password "${password}"`
    );

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const response = await fetch(photoURL);

      const blob = await response.blob();

      const storageRef = ref(storage, "img");
      uploadBytes(storageRef, img).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailValid(validateEmail(text));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const showPass = () => {
    setShowPassword(!showPassword);
    setShowPassText(!showPassword ? "Показати" : "Скрити");
  };

  const onImagePick = async () => {
    const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPermission(status.status === "granted");

    if (status.status !== "granted") {
      Alert.alert("Помилка", "Дозвіл на доступ до медіатеки не надано.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    setPhotoURL(result.assets[0].uri);
  };

  const onDeletePhoto = () => {
    setPhotoURL("");
  };

  return (
    <KeyboardAvoidingContainer>
      <View style={styles.container}>
        <ImageBackground source={bg} style={styles.img}>
          <View style={styles.customContainer}>
            <View>
              {photoURL ? (
                <TouchableOpacity onPress={() => onDeletePhoto()}>
                  <Image source={{ uri: photoURL }} style={styles.photo} />

                  <Image
                    source={require("../assets/img/cross.png")}
                    style={styles.photoCross}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.photo}
                  onPress={() => onImagePick()}
                >
                  <Image
                    source={require("../assets/img/plus.png")}
                    style={styles.photoPlus}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.text}>Реєстрація</Text>

            <TextInput
              type="text"
              placeholder="Логін"
              required
              style={[
                styles.formItem,
                loginFocused ? styles.formItemFocused : null,
              ]}
              value={displayName}
              onChangeText={setDisplayName}
              onFocus={() => setLoginFocused(true)}
              onBlur={() => setLoginFocused(false)}
            />
            <TextInput
              type="email"
              placeholder="Адреса електронної пошти"
              required
              style={[
                styles.formItem,
                emailFocused ? styles.formItemFocused : null,
              ]}
              value={email}
              onChangeText={handleEmailChange}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
            <TextInput
              type="password"
              placeholder="Пароль"
              required
              style={[
                styles.formItem,
                passwordFocused ? styles.formItemFocused : null,
              ]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity style={styles.showPass} onPress={showPass}>
              <Text style={styles.showPassText}>{showPassText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.formBtn} onPress={handleSubmit}>
              <Text style={styles.formBtnText}>Зареєстуватися</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nav}
              onPress={() => navigation.navigate("LogIn")}
            >
              <Text style={styles.navText}>Вже є акаунт? Увійти</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  img: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "cover",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  customContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingBottom: 132,
    width: "100%",
    height: 489,
    marginTop: 279,
  },
  text: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 35.16,
    letterSpacing: 0.01,
    marginTop: 92,
    textAlign: "center",
  },
  photo: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    position: "absolute",
    top: -60,
    right: "40%",
  },
  photoPlus: {
    width: 25,
    height: 25,
    position: "absolute",
    top: 20,
    left: 255,
  },
  form: {
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    marginHorizontal: 16,
  },
  formItem: {
    width: "100%",
    fontFamily: "Roboto-Regular",
    color: "#000",
    fontSize: 16,
    backgroundColor: "#F6F6F6",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
  },
  formItemFocused: {
    backgroundColor: "#fff",
    borderColor: "#FF6C00",
  },
  formBtn: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 111.5,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    marginTop: 27,
    textAlign: "center",
  },
  formBtnText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#fff",
  },
  showPass: {
    position: "absolute",
    top: "55%",
    right: 16,
  },
  showPassText: {
    fontSize: 16,
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
  },
  nav: {
    marginTop: 32,
  },
  navText: {
    textAlign: "center",
    fontSize: 16,
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
  },
});

export default RegistrationScreen;
