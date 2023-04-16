import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Colors, PageLogo } from "../components/styles";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;
const { primary, secondary } = Colors;

const Authentication = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <PageLogo
        resizeMode="cover"
        source={require("./../assets/img/Hyperion-logo.png")}
      />
      <View style={styles.innerArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Signup");
          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: StatusBarHeight + 10,
    paddingTop: "30%",
    backgroundColor: primary,
    alignItems: "center",
  },
  innerArea: {
    width: "90%",
    marginTop: "60%",
  },
  button: {
    backgroundColor: secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 5,
    height: 60,
  },
  buttonText: {
    color: primary,
    fontSize: 20,
  },
});

export default Authentication;
