import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import bg from "../assets/img/Photo BG.jpg";
import CustomInput from "../componets/CustomInput";
import CustomButton from "../componets/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import PasswordCustonInput from "../componets/CustomInput/PasswordCustonInput";
import KeyboardAvoidingContainer from "../componets/KeyboardAvoidingContainer";
import { auth } from "../firebase/config";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showPassText, setShowPassText] = useState("Показати");
  const [loading, setLoading] = useState(false);

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

  const onSingInPress = () => {
    if (!email ?? !password) {
      alert("Заповніть всі плоля");
    }
    if (!isEmailValid) {
      return Alert.alert(
        "Помилка",
        "Введіть коректну адресу електронної пошти"
      );
    }
    console.log(`Email: "${email}"; Password "${password}"`);

    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user);
        dispatch(
          logIn({
            displayName: response.user.displayName,
            photoURL: response.user.photoURL,
            email: response.user.email,
            uid: response.user.uid,
          })
        );
        navigation.navigate("Home");
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Помилка", "Логін чи пароль невірні");
      });

    setEmail("");
    setPassword("");
    setShowPassword(true);
    setShowPassText("Показати");
  };

  return (
    <>
      <KeyboardAvoidingContainer>
        <View style={styles.container}>
          <ImageBackground source={bg} style={styles.img}>
            <View style={styles.customContainer}>
              <Text style={styles.text}>Увійти</Text>
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
              <TouchableOpacity style={styles.formBtn} onPress={onSingInPress}>
                <Text style={styles.formBtnText}>Увійти</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nav}
                onPress={() => navigation.navigate("Registration")}
              >
                <Text style={styles.navText}>
                  Немає акаунту? Зареєструватися
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingContainer>
    </>
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
    marginVertical: 32,
    textAlign: "center",
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
  },
  formBtnText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#fff",
    textAlign: "center",
  },
  showPass: {
    position: "absolute",
    top: "40%",
    right: 16,
  },
  showPassText: {
    fontSize: 16,
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
  },
});
export default LoginScreen;
