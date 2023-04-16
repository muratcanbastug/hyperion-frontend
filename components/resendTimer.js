import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../components/styles";
const { primary, secondary, red, green, tertiary } = Colors;

const ResendTimer = ({
  activeResend,
  resendEmail,
  resendingEmail,
  resendStatus,
  timeLeft,
  targetTime,
}) => {
  return (
    <View>
      <View style={styles.inlineGroup}>
        <Text style={styles.infoText}>Didn't receive the email? </Text>
        {!resendingEmail && (
          <TouchableOpacity
            style={[styles.textLink, !activeResend && styles.opacity]}
            disabled={!activeResend}
            onPress={resendEmail}
          >
            <Text
              style={[
                styles.textLinkContent,
                resendStatus === "Failed!" && styles.red,
                resendStatus === "Sent!" && styles.green,
              ]}
            >
              {resendStatus}
            </Text>
          </TouchableOpacity>
        )}

        {resendingEmail && (
          <TouchableOpacity style={styles.textLink} disabled={true}>
            <Text style={styles.textLinkContent}>
              <ActivityIndicator color={secondary} />
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {!activeResend && (
        <Text style={styles.infoText}>
          in
          <Text style={styles.emphasizeText}>{` ${
            timeLeft || targetTime
          } `}</Text>
          second(s)
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inlineGroup: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textLink: {
    justifyContent: "center",
    alignItems: "center",
  },
  textLinkContent: {
    color: green,
    fontSize: 20,
    textDecorationLine: "underline",
  },
  red: {
    color: red,
  },
  green: {
    color: green,
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
  opacity: {
    opacity: 0.3,
  },
});

export default ResendTimer;
