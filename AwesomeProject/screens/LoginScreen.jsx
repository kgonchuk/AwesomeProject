import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import bg from "../assets/img/Photo BG.jpg";
import CustomInput from "../componets/CustomInput";
import CustomButton from "../componets/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import PasswordCustonInput from "../componets/CustomInput/PasswordCustonInput";
import KeyboardAvoidingContainer from "../componets/KeyboardAvoidingContainer";

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log(errors);
  const navigation = useNavigation();

  const onSingInPress = (data) => {
    console.log(data);
    console.warn("SingIn Wellcome");
    navigation.navigate("Home");
  };

  const onSingUpPress = () => {
    console.warn("SingUp wellcome");
    navigation.navigate("Registration");
  };
  return (
    <>
      <KeyboardAvoidingContainer>
        <View style={styles.container}>
          <ImageBackground source={bg} style={styles.img}>
            <View style={styles.customContainer}>
              <Text style={styles.text}>Увійти</Text>
              <CustomInput
                name="userMail"
                placeholder="Адреса електронної пошти"
                control={control}
                rules={{ required: "User name is required" }}
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
                onPress={handleSubmit(onSingInPress)}
                text="Увійти"
                type="PRIMARY"
              />
              <CustomButton
                onPress={onSingUpPress}
                text="Немає акаунту? Зареєструватися"
                type="TERTTIARY"
              />
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
});
export default LoginScreen;
