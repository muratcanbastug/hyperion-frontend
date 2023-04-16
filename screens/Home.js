import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { CredentialsContext } from "../components/credentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../components/styles";
const { primary, secondary, red, darkLight, tertiary } = Colors;

const Home = ({ navigation }) => {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { userName, email } = storedCredentials;
  console.log(userName, email);

  const cleareLogin = () => {
    AsyncStorage.removeItem("Hyperion/LoginCredentials")
      .then(() => {
        setStoredCredentials("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Text>
        Home Page, {userName} {email}
      </Text>
      <View style={styles.innerArea}>
        <TouchableOpacity style={styles.logout} onPress={cleareLogin}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  logout: {
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
export default Home;
