import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput, Text } from "react-native";
import { Colors } from "./../components/styles";
const { primary, secondary, lightRed, green, lightGreen } = Colors;

const CodeInputField = ({ setPinReady, code, setCode, maxLength }) => {
  const codeDigitsArray = new Array(maxLength).fill(0);

  const textInputRef = useRef(null);
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);

  const handleOnPress = () => {
    setInputContainerIsFocused(true);
    textInputRef?.current?.focus();
  };

  const handleOnBlur = () => {
    setInputContainerIsFocused(false);
  };

  useEffect(() => {
    setPinReady(code.length === maxLength);
    return () => setPinReady(false);
  }, [code]);

  const toCodeDigitInput = (_value, index) => {
    const emptyInputChar = " ";
    const digit = code[index] || emptyInputChar;

    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;

    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);
    const StyledCodeInput = inputContainerIsFocused && isDigitFocused;

    if (StyledCodeInput) {
      return (
        <View key={index} style={[styles.CodeInput, styles.green]}>
          <Text style={styles.CodeInputText}>{digit}</Text>
        </View>
      );
    } else {
      return (
        <View key={index} style={styles.CodeInput}>
          <Text style={styles.CodeInputText}>{digit}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.CodeInputSection}>
      <Pressable style={styles.CodeInputContainer} onPress={handleOnPress}>
        {codeDigitsArray.map(toCodeDigitInput)}
      </Pressable>
      <TextInput
        style={styles.HiddenTextInput}
        ref={textInputRef}
        value={code}
        onChangeText={setCode}
        onSubmitEditing={handleOnBlur}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  CodeInputSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  HiddenTextInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  CodeInputContainer: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  CodeInput: {
    borderColor: lightGreen,
    minWidth: "15%",
    borderWidth: 2,
    borderRadius: 5,
    padding: 12,
  },
  CodeInputText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: secondary,
  },
  green: {
    borderColor: green,
  },
});

export default CodeInputField;
