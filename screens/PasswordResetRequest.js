import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";

import KeyboardAvoidingWrapper from "./../components/keyboardAvoidingWrapper";
import { Colors, ErrorMessage } from "./../components/styles";
import { Octicons } from "@expo/vector-icons";
import { baseAPIUrl } from "../components/shared";

import { Formik } from "formik";

import axios from "axios";

const { primary, secondary, lightRed, tertiary, green, lightGreen, darkLight } =
  Colors;

const PasswordResetRequest = ({ navigation }) => {
  const [hideErrMsg, setHideErrMsg] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleMessage = (message, messageType = "FAILED") => {
    setMessage(message);
    setMessageType(messageType);
    setHideErrMsg(true);
  };

  const handleSendCode = (credentials, setSubmitting) => {
    handleMessage(null);
    setHideErrMsg(false);
    const url = `${baseAPIUrl}/user/requestPasswordReset/`;
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
          navigation.navigate("ResetPassword", { ...data });
        }
        setSubmitting(false);
      })
      .catch((err) => {
        console.log(err);
        handleMessage("An error occurred. Check your network and try again.");
        setSubmitting(false);
      });
  };

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        <View style={styles.innerAreaTop}>
          <View style={styles.iconBg}>
            <StatusBar style="dark" />
            <Octicons name="lock" size={125} color={secondary} />
          </View>
        </View>
        <View style={styles.innerAreaBottom}>
          <Text style={styles.tittleText}>Reset Password</Text>
          <Text style={styles.infoText}>
            Enter the email associated with your account and we'll send an email
            with 4-digit code to reset your password.
          </Text>
          <Formik
            initialValues={{ email: "" }}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              if (values.email == "") {
                handleMessage("Please enter email");
                setSubmitting(false);
              } else {
                handleSendCode(values, setSubmitting);
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
                {hideErrMsg && (
                  <ErrorMessage type={messageType}>{message}</ErrorMessage>
                )}
                {!isSubmitting && (
                  <TouchableOpacity
                    style={styles.sendCode}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>Send Code</Text>
                  </TouchableOpacity>
                )}
                {isSubmitting && (
                  <TouchableOpacity disabled={true} style={styles.sendCode}>
                    <ActivityIndicator color={primary}></ActivityIndicator>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ icon, ...props }) => {
  return (
    <View borderWidth={1} marginVertical={25} borderRadius={5}>
      <View style={styles.rightIcon}>
        <Octicons name={icon} size={30} color={secondary} />
      </View>
      <TextInput style={styles.styledTextInput} {...props} />
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
  innerAreaTop: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  innerAreaBottom: {
    flex: 1,
    justifyContent: "space-around",
  },
  iconBg: {
    width: 250,
    height: 250,
    backgroundColor: lightGreen,
    borderRadius: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  tittleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: secondary,
    textAlign: "center",
    paddingTop: 20,
  },
  infoText: {
    color: tertiary,
    fontSize: 17,
    textAlign: "center",
  },
  styledTextInput: {
    backgroundColor: primary,
    paddingLeft: 55,
    paddingRight: 20,
    fontSize: 16,
    height: 50,
    color: tertiary,
  },
  rightIcon: {
    left: 15,
    top: 10,
    position: "absolute",
    zIndex: 1,
  },
  sendCode: {
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
});

export default PasswordResetRequest;
