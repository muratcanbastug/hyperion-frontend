import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import KeyboardAvoidingWrapper from "./../components/keyboardAvoidingWrapper";
import { Colors } from "./../components/styles";
import { Octicons, Ionicons } from "@expo/vector-icons";
import CodeInputField from "../components/codeInputField";
import ResendTimer from "../components/resendTimer";

import VerificationModal from "../components/verificationModal";
import { baseAPIUrl } from "../components/shared";

import { CredentialsContext } from "../components/credentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

const { primary, secondary, lightRed, tertiary, green, lightGreen } = Colors;

const Verification = ({ route }) => {
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

  const resendEmail = async () => {
    setResendingEmail(true);

    const url = `${baseAPIUrl}/user/resendOTPVerificationCode`;
    try {
      await axios.post(url, { email, userId });
      setResendStatus("Sent!");
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

  const submitOTPVerification = async () => {
    try {
      setVerifying(true);
      const url = `${baseAPIUrl}/user/verifyOTP/`;
      const result = await axios.post(url, { userId, otp: code });
      const { data } = result;

      if (data.status !== "VERIFIED") {
        setVerificationSuccessful(false);
        setRequestMessage(data.message);
      } else {
        setVerificationSuccessful(true);
      }

      setModalVisible(true);
      setVerifying(false);
    } catch (err) {
      setRequestMessage(err.message);
      setVerificationSuccessful(false);
      setModalVisible(true);
      setVerifying(false);
    }
  };

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const persistLoginAfterOTPVerification = async () => {
    try {
      const tempUser = await AsyncStorage.getItem("tempUser");
      await AsyncStorage.setItem(
        "Hyperion/LoginCredentials",
        JSON.stringify(tempUser)
      );
      setStoredCredentials(JSON.stringify(tempUser));
    } catch (err) {
      alert(`Error with persisting user data.`);
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
          <Text style={styles.tittleText}>Account Verification</Text>
          <Text style={styles.infoText}>
            Please enter 4-digit code sent to
            <Text style={styles.emphasizeText}>{` ${email}`}</Text>
          </Text>

          <CodeInputField
            setPinReady={setPinReady}
            code={code}
            setCode={setCode}
            maxLength={MAX_CODE_LENGTH}
          />

          {!verifying && pinReady && (
            <TouchableOpacity
              style={styles.button}
              onPress={submitOTPVerification}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          )}
          {!verifying && !pinReady && (
            <TouchableOpacity
              disabled={true}
              style={[styles.button, styles.buttonDisabled]}
            >
              <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
                Verify
              </Text>
            </TouchableOpacity>
          )}
          {verifying && (
            <TouchableOpacity disabled={true} style={styles.button}>
              <ActivityIndicator size="large" color={primary} />
            </TouchableOpacity>
          )}

          <ResendTimer
            activeResend={activeResend}
            resendingEmail={resendingEmail}
            resendStatus={resendStatus}
            timeLeft={timeLeft}
            targetTime={targetTime}
            resendEmail={resendEmail}
          />
        </View>
        <VerificationModal
          succesful={verificationSuccessful}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          requestMessage={requestMessage}
          persistLoginAfterOTPVerification={persistLoginAfterOTPVerification}
        />
      </View>
    </KeyboardAvoidingWrapper>
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
});

export default Verification;
