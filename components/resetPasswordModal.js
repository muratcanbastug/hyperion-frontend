import React from "react";
import { StatusBar } from "expo-status-bar";
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Colors } from "./styles";
import { Ionicons } from "@expo/vector-icons";
const { primary, secondary, red, tertiary, green, lightGreen } = Colors;

const ResetPasswordModal = ({
  modalVisible,
  setModalVisible,
  succesful,
  requestMessage,
  navigation,
}) => {
  const buttonHandler = () => {
    if (succesful) {
      navigation.navigate("Login");
    }
    setModalVisible(false);
  };
  return (
    <Modal animationType="slide" visible={modalVisible} transparent={true}>
      <View style={styles.container}>
        {!succesful && (
          <FailContent
            buttonHandler={buttonHandler}
            errorMsg={requestMessage}
          />
        )}

        {succesful && <SuccesContent buttonHandler={buttonHandler} />}
      </View>
    </Modal>
  );
};

const SuccesContent = ({ buttonHandler }) => {
  return (
    <View style={styles.modalView}>
      <StatusBar style="dark" />
      <Ionicons name="checkmark-circle" size={100} color={green} />
      <Text style={styles.tittleText}>Reset!</Text>
      <Text style={styles.infoText}>
        You have succesfully reset your password.
      </Text>
      <TouchableOpacity style={styles.button} onPress={buttonHandler}>
        <Text style={styles.buttonText}>Continue </Text>
        <Ionicons name="arrow-forward-circle" size={25} color={primary} />
      </TouchableOpacity>
    </View>
  );
};

const FailContent = ({ errorMsg, buttonHandler }) => {
  return (
    <View style={styles.modalView}>
      <StatusBar style="dark" />
      <Ionicons name="close-circle" size={100} color={red} />
      <Text style={styles.tittleText}>Failed!</Text>
      <Text style={styles.infoText}>
        {`You can't reset your password: ${errorMsg}`}
      </Text>
      <TouchableOpacity
        style={[styles.button, styles.red]}
        onPress={buttonHandler}
      >
        <Text style={styles.buttonText}>Try Again </Text>
        <Ionicons name="arrow-redo-circle" size={25} color={primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    margin: 20,
    backgroundColor: primary,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "80%",
  },
  tittleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: secondary,
    textAlign: "center",
    paddingTop: 20,
    marginBottom: 10,
  },
  infoText: {
    color: tertiary,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: green,
    borderRadius: 5,
    marginVertical: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: primary,
    fontSize: 18,
  },
  red: {
    backgroundColor: red,
  },
});

export default ResetPasswordModal;
