import React, { useState } from "react";
import AppLoading from "expo-app-loading";
import RootStack from "./navigators/RootStack";

import { CredentialsContext } from "./components/credentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = () => {
    AsyncStorage.getItem("Hyperion/LoginCredentials")
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };

  if (!isLoadingComplete) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setLoadingComplete(true)}
        onError={console.warn}
      />
    );
  }
  return (
    <CredentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials }}
    >
      <RootStack />
    </CredentialsContext.Provider>
  );
}
