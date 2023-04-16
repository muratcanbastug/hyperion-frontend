import React, { useState, useContext } from "react";
import {
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import KeyboardAvoidingWrapper from "../components/keyboardAvoidingWrapper";

import { PageLogo, Colors, ErrorMessage } from "../components/styles";
import { Formik } from "formik";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import Constants from "expo-constants";

import axios from "axios";

import { CredentialsContext } from "../components/credentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseAPIUrl } from "../components/shared";

const StatusBarHeight = Constants.statusBarHeight;

const { primary, secondary, red, darkLight, tertiary } = Colors;

const Login = ({ navigation, route }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideErrMsg, setHideErrMsg] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    setHideErrMsg(false);
    const url = `${baseAPIUrl}/user/signin`;
    axios
      .post(url, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        const { message, status, data } = res.data;
        if (status !== "SUCCESS") {
          handleMessage(message, status);
        } else {
          persistLogin({ ...data[0] }, message, status);
        }
        setSubmitting(false);
      })
      .catch((err) => {
        console.log(err);
        handleMessage("An error occurred. Check your network and try again.");
        setSubmitting(false);
      });
  };

  const handleMessage = (message, messageType = "FAILED") => {
    setMessage(message);
    setMessageType(messageType);
    setHideErrMsg(true);
  };

  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem(
      "Hyperion/LoginCredentials",
      JSON.stringify(credentials)
    )
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((err) => {
        console.log(err);
        handleMessage("Persistent login failed.");
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <PageLogo
          resizeMode="cover"
          source={require("./../assets/img/Hyperion-logo.png")}
        />
        <Formik
          initialValues={{ email: route?.params?.email, password: "" }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            if (values.email == "" || values.password == "") {
              handleMessage("Please fill all fields");
              setSubmitting(false);
            } else {
              handleLogin(values, setSubmitting);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isSubmitting,
          }) => (
            <View style={styles.innerArea}>
              <MyTextInput
                icon="mail"
                label="Email Address"
                placeholder="Email"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
              />
              <MyTextInput
                icon="lock"
                label="Password"
                placeholder="* * * * * * * * * *"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />
              {hideErrMsg && (
                <ErrorMessage type={messageType}>{message}</ErrorMessage>
              )}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PasswordResetRequest");
                }}
              >
                <Text style={styles.passText}>forgot password?</Text>
              </TouchableOpacity>
              {!isSubmitting && (
                <TouchableOpacity style={styles.signin} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
              )}
              {isSubmitting && (
                <TouchableOpacity disabled={true} style={styles.signin}>
                  <ActivityIndicator color={primary}></ActivityIndicator>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.google} onPress={handleSubmit}>
                <Fontisto name="google" size={25} color={primary} />
                <Text style={styles.buttonText} marginLeft={"5%"}>
                  Sign In with Google
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View style={styles.bottomTextArea}>
          <Text style={styles.text}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signup");
            }}
          >
            <Text style={styles.linkedText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({
  hidePassword,
  setHidePassword,
  isPassword,
  icon,
  ...props
}) => {
  return (
    <View borderWidth={1} marginVertical={10} borderRadius={5}>
      <View style={styles.rightIcon}>
        <Octicons name={icon} size={30} color={secondary} />
      </View>
      <TextInput style={styles.styledTextInput} {...props} />
      {isPassword && (
        <TouchableOpacity
          style={styles.leftIcon}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={30}
            color={secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: "30%",
    backgroundColor: primary,
    alignItems: "center",
  },
  innerArea: {
    width: "85%",
    marginTop: "20%",
    marginBottom: "5%",
  },
  passText: {
    textAlign: "right",
    marginBottom: 5,
    fontSize: 14,
    color: "red",
  },
  signin: {
    backgroundColor: secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 5,
    height: 50,
    marginVertical: 10,
  },
  buttonText: {
    color: primary,
    fontSize: 20,
    marginLeft: 15,
  },
  google: {
    backgroundColor: red,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 8,
    height: 50,
    shadowcolor: secondary,
    elevation: 5,
    flexDirection: "row",
  },
  bottomTextArea: {
    justifContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
    marginBottom: 25,
  },
  text: {
    fontSize: 15,
  },
  linkedText: {
    fontSize: 15,
    color: "darkblue",
    marginLeft: 4,
  },
  rightIcon: {
    left: 15,
    top: 10,
    position: "absolute",
    zIndex: 1,
  },
  leftIcon: {
    right: 15,
    top: 10,
    position: "absolute",
    zIndex: 1,
  },
  styledTextInput: {
    backgroundColor: primary,
    paddingHorizontal: 55,
    fontSize: 16,
    height: 50,
    color: tertiary,
  },
});
export default Login;
