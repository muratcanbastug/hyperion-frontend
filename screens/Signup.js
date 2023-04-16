import React, { useState, useContext } from "react";
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

import { PageLogo, Colors, ErrorMessage } from "../components/styles";

import KeyboardAvoidingWrapper from "../components/keyboardAvoidingWrapper";

import { Formik } from "formik";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import Constants from "expo-constants";

import { CredentialsContext } from "../components/credentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseAPIUrl } from "../components/shared";

const StatusBarHeight = Constants.statusBarHeight;
const { primary, secondary, tertiary, darkLight, red } = Colors;

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideErrMsg, setHideErrMsg] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const handleSignup = async (credentials, setSubmitting) => {
    handleMessage(null);
    setHideErrMsg(false);
    const url = `${baseAPIUrl}/user/signup`;
    axios
      .post(url, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const { message, status, data } = res.data;
        if (status !== "PENDING") {
          handleMessage(message, status);
        } else {
          temporaryUserPersist(({ email, userName } = credentials));
          navigation.navigate("Verification", { ...data });
        }
        setSubmitting(false);
      })
      .catch((err) => {
        console.log(err);
        handleMessage("An error occurred. Check your network and try again.");
        setSubmitting(false);
      });
  };

  const temporaryUserPersist = async (credentials) => {
    try {
      await AsyncStorage.setItem("tempUser", JSON.stringify(credentials));
    } catch (err) {
      handleMessage("Error with initial data handling.");
    }
  };

  const handleMessage = (message, messageType = "FAILED") => {
    setMessage(message);
    setMessageType(messageType);
    setHideErrMsg(true);
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
          initialValues={{ userName: "", email: "", password: "" }}
          onSubmit={(values, { setSubmitting }) => {
            if (
              values.userName == "" ||
              values.email == "" ||
              values.password == ""
            ) {
              handleMessage("Please fill all fields");
              setSubmitting(false);
            } else {
              handleSignup(values, setSubmitting);
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
                icon="person"
                label="UserName"
                placeholder="User Name"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("userName")}
                onBlur={handleBlur("userName")}
                value={values.userName}
              />
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
              {!isSubmitting && (
                <TouchableOpacity style={styles.signup} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              )}
              {isSubmitting && (
                <TouchableOpacity disabled={true} style={styles.signup}>
                  <ActivityIndicator color={primary}></ActivityIndicator>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.google} onPress={handleSubmit}>
                <Fontisto name="google" size={25} color={primary} />
                <Text style={styles.buttonText} marginLeft={15}>
                  Sign up with Google
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <View style={styles.bottomTextArea}>
          <Text style={styles.text}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.linkedText}>Sign In</Text>
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
    paddingTop: "25%",
    backgroundColor: primary,
    alignItems: "center",
  },
  innerArea: {
    width: "85%",
    marginTop: "10%",
    marginBottom: "5%",
  },
  passText: {
    textAlign: "right",
    marginRight: 5,
    marginBottom: 5,
    fontSize: 14,
    color: "red",
  },
  signup: {
    backgroundColor: secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
    paddingLeft: 55,
    paddingRight: 55,
    fontSize: 16,
    height: 50,
    color: tertiary,
  },
});
export default Signup;
