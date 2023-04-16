import styled from "styled-components";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

// Colors
export const Colors = {
  primary: "#FFFFFF",
  secondary: "#000000",
  tertiary: "#1F2937",
  darkLight: "#9CA3AF",
  green: "#10B981",
  red: "#EF4444",
  lightRed: "rgba(255, 0, 0, 0.1)",
  lightGreen: "rgba(16, 185, 129, 0.3)",
};

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

// Fonts
export default Fonts = {
  title: "30px",
  subTitle: "20px",
};

const { title, subTitle } = Fonts;

export const ErrorMessage = styled.Text`
  text-align: center;
  font-size: 14px;
  color: ${(props) => (props.type === "SUCCESS" ? green : red)};
`;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 10}px;
  margin-top: 30%;
  background-color: ${primary};
`;

export const StyledContainerSignIn = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 10}px;
  margin-top: 20%;
  background-color: ${primary};
`;

export const StyledContainerSignup = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 10}px;
  margin-top: 13%;
  background-color: ${primary};
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const PageLogo = styled.Image`
  width: 300px;
  height: 240px;
`;

// export const PageTitle = styled.Text`
//   font-size: 30px;
//   text-align: center;
//   font-weight: bold;
//   color: ${brand};
//   padding: 10px;
// `;

export const SubTitle = styled.Text`
  font-size: ${subTitle};
  margin-bottom: 20px;
  letter-spacing: 1px;
  text-align: center;
  color: ${secondary};
`;

export const StyledInnerArea = styled.View`
  width: 90%;
  margin: 20%;
`;

export const StyledInnerAreaSignIn = styled.View`
  width: 90%;
  margin-top: 10%;
  margin-bottom: 5%;
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${secondary};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-vertical: 5px;
  height: 60px;
  shadowcolor: ${secondary};
  elevation: 5;
`;

export const StyledButtonSignIn = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${secondary};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-vertical: 13px;
  margin-horizontal: 10px;
  height: 50px;
  shadowcolor: ${secondary};
  elevation: 5;
`;

export const StyledButtonGoogle = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${red};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-horizontal: 10px;
  margin-bottom: 8px;
  height: 50px;
  shadowcolor: ${secondary};
  elevation: 5;
  flex-direction: row;
`;

export const ButtonText = (StyledText = styled.Text`
  color: ${primary};
  font-size: ${subTitle};
`);

export const ButtonTextGoogle = (StyledText = styled.Text`
  color: ${primary};
  font-size: 20px;
  margin-left: 15px;
`);

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${secondary};
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${primary};
  padding-left: 55px;
  padding-right: 55px;
  font-size: 16px;
  height: 50px;
  color: ${tertiary};
`;

export const SignInMsg = styled.Text`
  text-align: right;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 14px;
  color: red;
`;

export const SignupMsg = styled.Text`
  text-align: right;
  margin-right: 5px;
  font-size: 15px;
  color: ${secondary};
`;

export const TextLink = styled.TouchableOpacity`
  text-align: right;
`;

export const TextLinkContent = styled.Text`
  font-size: 15px;
  color: darkblue;
`;

export const SignInTextView = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 10px;
`;
// export const StyledInputLabel = styled.Text`
//   color: ${tertiary};
//   font-size: 13px;
//   text-align: left;
// `;

export const LeftIcon = styled.View`
  left: 15px;
  top: 10px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 10px;
  position: absolute;
  z-index: 1;
`;
