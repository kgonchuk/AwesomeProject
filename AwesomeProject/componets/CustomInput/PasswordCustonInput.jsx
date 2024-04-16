import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

const PasswordCustonInput = ({
  rules = {},
  control,
  name,
  placeholder,
  secureTextEntry,
}) => {
  const [isVisiblePassword, setIsvisiblePassword] = useState(true);
  const handleTogglePassword = () => {
    setIsvisiblePassword(!isVisiblePassword);
  };
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.conainer,
              { borderColor: error ? "red" : "#E8E8E8" },
            ]}
          >
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={isVisiblePassword}
            />
            <TouchableOpacity
              style={styles.showPassword}
              onPress={handleTogglePassword}
            >
              {isVisiblePassword ? (
                <Text>Показати</Text>
              ) : (
                <Text>Приховати</Text>
              )}
            </TouchableOpacity>
          </View>
          {error && (
            <Text style={{ color: "red" }}>{error.message || "Error"}</Text>
          )}
        </>
      )}
    />
  );
};
const styles = StyleSheet.create({
  conainer: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#E8E8E8",
    width: "100%",
    height: 50,
    paddingTop: 16,
    paddingBottom: 15,
    paddingLeft: 16,
    marginBottom: 16,
  },
  input: {},
  showPassword: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    top: 0,
    bottom: 0,
    right: 16,
  },
});
export default PasswordCustonInput;
