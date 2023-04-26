import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screeens
import Login from "./../screens/Login";
import Authentication from "./../screens/Authentication";
import Signup from "./../screens/Signup";
import Home from "./../screens/Home";
import Verification from "./../screens/OtpVerification";
import PasswordResetRequest from "./../screens/PasswordResetRequest";
import ResetPassword from "./../screens/ResetPassword";
import ProgramDetails from "./../screens/ProgramDetails";

import { Colors } from "../components/styles";

const { primary } = Colors;
const Stack = createNativeStackNavigator();

import { CredentialsContext } from "../components/credentialsContext";

const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "transparent",
              },
              headerTintColor: primary,
              headerTransparent: true,
              headerTitle: "",
              contentStyle: { backgroundColor: "#fff" },
            }}
            initialRouteName="Authentication" // default: "Authentication"
          >
            {storedCredentials ? (
              <Stack.Screen name="Home" component={Home} />
            ) : (
              <>
                <Stack.Screen
                  name="Authentication"
                  component={Authentication}
                />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Verification" component={Verification} />
                <Stack.Screen
                  name="PasswordResetRequest"
                  component={PasswordResetRequest}
                />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen
                  name="ProgramDetails"
                  component={ProgramDetails}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
  );
};

export default RootStack;
