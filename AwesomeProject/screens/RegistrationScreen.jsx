import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import React, { useState } from "react";
import bg from "../assets/img/Photo BG.jpg";
import CustomInput from "../componets/CustomInput";
import CustomButton from "../componets/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import plus from "../assets/img/add.png";
import KeyboardAvoidingContainer from "../componets/KeyboardAvoidingContainer";
import PasswordCustonInput from "../componets/CustomInput/PasswordCustonInput";

const RAGEX_EMAIL =
  /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;

const RegistrationScreen = () => {
  const [isVisiblePassword, setIsvisiblePassword] = useState(false);

  const navigation = useNavigation();
  const { control, handleSubmit } = useForm();

  const onSingInPress = () => {
    console.warn("SingIn Wellcome");
    navigation.navigate("LogIn");
  };
  const onSingUpPress = () => {
    console.warn("SingUp wellcome");
    navigation.navigate("Home");
  };
  return (
    <KeyboardAvoidingContainer>
      <View style={styles.container}>
        <ImageBackground source={bg} style={styles.img}>
          <View style={styles.customContainer}>
            <Text style={styles.text}>Реєстрація</Text>
            <Image style={styles.photo} />
            <Image source={plus} style={styles.photoPlus} />
            <CustomInput
              name="userName"
              placeholder="Логін"
              control={control}
              type={isVisiblePassword ? "text" : "password"}
              rules={{
                required: "User name is required",
                minLength: {
                  value: 3,
                  message: "User name shoud be min 3 characters long",
                },
                maxLength: {
                  value: 24,
                  message: "User name shoud be max 24 characters long",
                },
              }}
            />
            <CustomInput
              name="userMail"
              placeholder="Адреса електронної пошти"
              control={control}
              rules={{
                required: "User mail is required",
                pattern: { value: RAGEX_EMAIL, message: "Email is not valid" },
              }}
            />
            <PasswordCustonInput
              name="pasword"
              control={control}
              placeholder="Пароль"
              rules={{
                required: "Passsword name is required",
                minLength: {
                  value: 3,
                  message: "Password shoud be min 3 characters",
                },
              }}
            />
            <CustomButton
              text="Зареєстуватися"
              type="PRIMARY"
              onPress={handleSubmit(onSingUpPress)}
            />
            <CustomButton
              text="Вже є акаунт? Увійти"
              type="TERTTIARY"
              onPress={onSingInPress}
            />
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
});

export default RegistrationScreen;
