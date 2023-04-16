import React, { useState, useEffect } from "react";
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
import { Octicons, Ionicons } from "@expo/vector-icons";
import CodeInputField from "../components/codeInputField";
import ResendTimer from "../components/resendTimer";

import ResetPasswordModal from "../components/resetPasswordModal";
import { baseAPIUrl } from "../components/shared";

import { CredentialsContext } from "../components/credentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";

import axios from "axios";

const { primary, secondary, lightRed, tertiary, green, lightGreen, darkLight } =
  Colors;

const ResetPassword = ({ route, navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideErrMsg, setHideErrMsg] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const [code, setCode] = useState("");
  const [pinReady, setPinReady] = useState(false);

  // verification button
  const [verifying, setVerifying] = useState(false);

  const MAX_CODE_LENGTH = 4;

  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  // resend timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [targetTime, setTargetTime] = useState(null);
  const [activeResend, setActiveResend] = useState(false);

  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState("Resend");

  let resendTimerInterval;

  const { email, userId } = route?.params;

  const triggerTimer = (targetTimeInSeconds = 30) => {
    setTargetTime(targetTimeInSeconds);
    setActiveResend(false);
    const finalTime = +new Date() + targetTimeInSeconds * 1000;
    resendTimerInterval = setInterval(() => calculateTimeLeft(finalTime), 1000);
  };

  const calculateTimeLeft = (finalTime) => {
    const difference = finalTime - +new Date();
    if (difference >= 0) {
      setTimeLeft(Math.round(difference / 1000));
    } else {
      clearInterval(resendTimerInterval);
      setActiveResend(true);
      setTimeLeft(null);
    }
  };

  useEffect(() => {
    triggerTimer();

    return () => {
      clearInterval(resendTimerInterval);
    };
  }, []);

  const handleMessage = (message, messageType = "FAILED") => {
    setMessage(message);
    setMessageType(messageType);
    setHideErrMsg(true);
  };

  const resendEmail = async () => {
    setResendingEmail(true);

    const url = `${baseAPIUrl}/user/resendPasswordResetVerificationCode`;
    try {
      const result = await axios.post(url, { email, userId });
      const { data } = result;
      if (data.status !== "PENDING") {
        handleMessage(data.message);
      } else {
        setResendStatus("Sent!");
      }
    } catch (err) {
      setResendStatus("Failed!");
      alert("Resending verification code failed!");
    }
    setResendingEmail(false);
    setTimeout(() => {
      setResendStatus("Resend!");
      setActiveResend(false);
      triggerTimer();
    }, 5000);
  };

  const handleResetPassword = async (credentials, setSubmitting) => {
    try {
      handleMessage(null);
      setHideErrMsg(false);
      setVerifying(true);
      const url = `${baseAPIUrl}/user/resetPassword/`;
      const result = await axios.post(url, {
        userId,
        otp: code,
        newPassword: credentials.password,
      });
      const { data } = result;

      if (data.status !== "SUCCESS") {
        setVerificationSuccessful(false);
        setRequestMessage(data.message);
        handleMessage(data.message);
      } else {
        setVerificationSuccessful(true);
      }

      setSubmitting(false);
      setModalVisible(true);
      setVerifying(false);
    } catch (err) {
      setRequestMessage(err.message);
      setVerificationSuccessful(false);
      setModalVisible(true);
      setVerifying(false);
      setSubmitting(false);
    }
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
            Please enter 4-digit code sent to
            <Text style={styles.emphasizeText}>{` ${email} `}</Text>
            and new password
          </Text>

          <CodeInputField
            setPinReady={setPinReady}
            code={code}
            setCode={setCode}
            maxLength={MAX_CODE_LENGTH}
          />
          <Formik
            initialValues={{ password: "" }}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              if (values.password == "") {
                handleMessage("Please fill all fields");
                setSubmitting(false);
              } else {
                handleResetPassword(values, setSubmitting);
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
              <View>
                <MyTextInput
                  icon="lock"
                  label="New Password"
                  placeholder="* * * * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                {hideErrMsg && (
                  <ErrorMessage type={messageType}>{message}</ErrorMessage>
                )}

                {!verifying && pinReady && !isSubmitting && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.buttonText}>Reset Password</Text>
                  </TouchableOpacity>
                )}
                {!verifying && !pinReady && (
                  <TouchableOpacity
                    disabled={true}
                    style={[styles.button, styles.buttonDisabled]}
                  >
                    <Text
                      style={[styles.buttonText, styles.buttonTextDisabled]}
                    >
                      Reset Password
                    </Text>
                  </TouchableOpacity>
                )}
                {verifying && isSubmitting && (
                  <TouchableOpacity disabled={true} style={styles.button}>
                    <ActivityIndicator size="large" color={primary} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Formik>

          <ResendTimer
            activeResend={activeResend}
            resendingEmail={resendingEmail}
            resendStatus={resendStatus}
            timeLeft={timeLeft}
            targetTime={targetTime}
            resendEmail={resendEmail}
          />
        </View>
        <ResetPasswordModal
          succesful={verificationSuccessful}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          requestMessage={requestMessage}
          navigation={navigation}
        />
      </View>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ hidePassword, setHidePassword, icon, ...props }) => {
  return (
    <View
      borderWidth={1}
      marginVertical={10}
      borderRadius={5}
      borderColor={lightGreen}
    >
      <View style={styles.rightIcon}>
        <Octicons name={icon} size={30} color={secondary} />
      </View>
      <TextInput style={styles.styledTextInput} {...props} />

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
    width: 200,
    height: 200,
    backgroundColor: lightGreen,
    borderRadius: 200,
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
    fontSize: 20,
    textAlign: "center",
  },
  emphasizeText: {
    fontWeight: "bold",
    color: secondary,
    textAlign: "center",
  },
  button: {
    padding: 15,
    backgroundColor: green,
    borderRadius: 5,
    marginVertical: 5,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: primary,
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: lightRed,
  },
  buttonTextDisabled: {
    color: "gray",
  },
  styledTextInput: {
    backgroundColor: primary,
    paddingHorizontal: 55,
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
  leftIcon: {
    right: 15,
    top: 10,
    position: "absolute",
    zIndex: 1,
  },
});

export default ResetPassword;
