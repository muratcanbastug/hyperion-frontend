import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";

import { CredentialsContext } from "../components/credentialsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Chart from "../components/chart";
import Body from "../components/body";
import { Colors } from "../components/styles";

const { primary } = Colors;

import DummyData from "../components/dummyData.json"; // just for testing purposes

import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { userName, email } = storedCredentials;
  console.log(userName, email);

  const muscles = DummyData.user[0].muscle; // Dummy data for test
  const programs = DummyData.user[2].programs; // Dummy data for test

  const bodyPart = {
    abdominals: muscles[0].muscleLevel,
    traps: muscles[1].muscleLevel,
    chest: muscles[2].muscleLevel,
    shoulders: muscles[3].muscleLevel,
    biceps: muscles[4].muscleLevel,
    forearms: muscles[5].muscleLevel,
    triceps: muscles[6].muscleLevel,
    obliques: muscles[7].muscleLevel,
    lats: muscles[8].muscleLevel,
    lower_back: muscles[9].muscleLevel,
    glutes: muscles[10].muscleLevel,
    hamsterings: muscles[11].muscleLevel,
    calves: muscles[12].muscleLevel,
    quads: muscles[13].muscleLevel,
  };

  const BottomSheetRef = useRef(null);
  const snapPoints = ["50%"];
  const [muscle, setmuscle] = useState(null);
  const [egzersizeHistoryVisible, setEgzersizeHistoryVisible] = useState(null);
  const [EgzersizeDayIndex, setEgzersizeDayIndex] = useState(null);

  useEffect(() => {
    if (muscle !== null) handlePresentModal();
  }, [muscle]);

  const handlePresentModal = () => {
    BottomSheetRef.current?.snapToIndex(0);
  };

  const handleSheetChanges = (index) => {
    if (index === -1) {
      setmuscle(null);
      setEgzersizeHistoryVisible(null);
    }
  };

  const bottomSheetContainer = (muscle) => {
    if (muscle !== null) {
      let labels = muscles[muscle].egzersizeHistory.map((egzersize) => {
        let l = new Date(egzersize.history);
        return l.getDate();
      });
      let quantity = muscles[muscle].egzersizeHistory.map(
        (egzersize) => egzersize.quantity
      );
      let intensity = muscles[muscle].egzersizeHistory.map(
        (egzersize) => egzersize.intensity
      );
      let muscleLevel = muscles[muscle].muscleLevel;
      let muscleName = muscles[muscle].muscleName;
      let egzersizeHistory = "";
      if (egzersizeHistoryVisible) {
        egzersizeHistory = new Date(
          muscles[muscle].egzersizeHistory[EgzersizeDayIndex].history
        );
      }
      return (
        <View style={styles.bottomSheetContainer}>
          <Chart
            muscleName={muscles[muscle].muscleName}
            labels={labels}
            quantity={quantity}
            intensity={intensity}
            setEgzersizeHistoryVisible={setEgzersizeHistoryVisible}
            setEgzersizeDayIndex={setEgzersizeDayIndex}
          />
          {muscleLevel === 3 && (
            <Text style={styles.textContainer}>
              You seem to be working your{" "}
              <Text style={{ fontWeight: "bold" }}>{muscleName}</Text> these
              days. You can focus on other muscle areas. {"\n"}Tap a point on
              the chart to view the exercise history.
            </Text>
          )}
          {muscleLevel === 2 && (
            <Text style={styles.textContainer}>
              You seem to be working your{" "}
              <Text style={{ fontWeight: "bold" }}>{muscleName}</Text> these
              days.{"\n"}Tap a point on the chart to view the exercise history.
            </Text>
          )}
          {muscleLevel === 1 && (
            <Text style={styles.textContainer}>
              You look like you haven't worked your biceps these days.{" "}
              <Text style={{ fontWeight: "bold" }}>{muscleName}</Text> these
              days. For a good body, you should keep all muscle part red. {"\n"}
              Tap a point on the chart to view the exercise history.
            </Text>
          )}
          {egzersizeHistoryVisible && (
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                {" "}
                Egzersizes on {egzersizeHistory.getDate()}{" "}
                {egzersizeHistory.toLocaleString("en-EN", { month: "long" })}:
              </Text>
              <ExerciseComponent
                exercises={
                  muscles[muscle].egzersizeHistory[EgzersizeDayIndex].egzersizes
                }
              />
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.innerAreaTop}>
          <Body
            width={350}
            height={350}
            top={0}
            BodyPart={bodyPart}
            setmuscle={setmuscle}
            setEgzersizeHistoryVisible={setEgzersizeHistoryVisible}
          />
          <Text
            style={{
              alignItems: "flex-start",
              width: Dimensions.get("window").width * 0.95,
            }}
          >
            Tap a muscle group to see exercise history
          </Text>
        </View>
        <View style={styles.innerAreaBottom}>
          <Text style={{ fontSize: 25 }}>Programs</Text>
          <Program programs={programs} navigation={navigation} />
        </View>

        <BottomSheet
          ref={BottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
          >
            {bottomSheetContainer(muscle)}
          </BottomSheetScrollView>
        </BottomSheet>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const ExerciseComponent = ({ exercises }) => {
  return (
    <View>
      {exercises.map((exercise, index) => (
        <View style={styles.egzersizeCard} key={index}>
          <Text style={styles.egzersizeTitle}>{exercise.egzersizeName}</Text>
          {exercise.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.egzersizeDetail}>
              <Text style={{ fontWeight: "500", fontSize: 18 }}>
                Set {setIndex + 1}:
              </Text>
              <Text style={{ fontSize: 16 }}>Repetition: {set.repetition}</Text>
              <Text style={{ fontSize: 16 }}>Weight: {set.weight}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const Program = ({ programs, navigation }) => {
  const handleProgramClick = (egzersizes) => {
    console.log(egzersizes);
    // navigation.navigate("ProgramDetails", { egzersizes });
  };

  return programs.map((program, index) => (
    <TouchableOpacity
      style={{
        width: "100%",
        borderRadius: 5,
        height: 60,
        marginVertical: 7,
        padding: 15,
        backgroundColor: "black",
        alignItems: "center",
        flexDirection: "row",
      }}
      key={index}
      onPress={handleProgramClick(program.egzersizes)}
    >
      <Text style={{ color: "white", fontSize: 20 }}>
        {program.programName}
      </Text>
      <View style={styles.rightIcon}>
        <Ionicons
          name={"arrow-forward-circle-outline"}
          size={30}
          color={primary}
        />
      </View>
    </TouchableOpacity>
  ));
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: primary,
    alignItems: "center",
  },
  innerAreaTop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerAreaBottom: {
    flex: 1,
    alignItems: "center",
    width: "92%",
  },
  bottomSheetContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  egzersizeCard: {
    alignItems: "flex-start",
    borderRadius: 16,
    width: Dimensions.get("window").width * 0.95,
    marginVertical: 4,
    backgroundColor: "#F7EBEB",
    padding: 10,
  },
  egzersizeTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  egzersizeDetail: {
    fontSize: 18,
    marginVertical: 4,
  },
  textContainer: {
    width: Dimensions.get("window").width * 0.95,
    marginVertical: 10,
    padding: 8,
    backgroundColor: "#F7EBEB",
    borderRadius: 10,
    fontSize: 15,
  },
  rightIcon: {
    right: 15,
    position: "absolute",
    zIndex: 1,
  },
});
export default Home;
