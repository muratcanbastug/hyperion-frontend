import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../components/styles";
import { Ionicons } from "@expo/vector-icons";

const { primary, secondary, lightRed } = Colors;

const ProgramDetails = ({ route }) => {
  const { program } = route.params;
  const handleEdit = () => {};

  const handleStart = () => {};
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Ionicons name="pencil" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{program.programName}</Text>
      {program.egzersizes.map((exersize, index) => (
        <View key={index} style={styles.exersizeContainer}>
          <Text style={styles.subtitle}>
            Exersize {index + 1}: {exersize.egzersizeName}
          </Text>
          {exersize.sets.map((set, index) => (
            <View key={index} style={styles.setContainer}>
              <Text style={styles.subtitle}>
                Set {index + 1}: Repetition: {set.repetition} Weight:{" "}
                {set.weight}
              </Text>
            </View>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "8%",
    padding: 16,
    backgroundColor: lightRed,
  },
  editButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: secondary,
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  exersizeContainer: {
    marginBottom: 16,
  },
  startButton: {
    alignSelf: "center",
    backgroundColor: secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width: "50%",
  },
  startButtonText: {
    color: primary,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProgramDetails;
