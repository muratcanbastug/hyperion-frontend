import React, {
  useContext,
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Button,
  Dimensions,
} from "react-native";

import Chart from "../components/chart";
import Body from "../components/body";
import { Colors } from "../components/styles";
const { primary } = Colors;

import DummyData from "../components/dummyData.json"; // just for testing purposes

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

const HomeScreen = () => {
  const muscles = DummyData.user[0].muscle; // Dummy data for test

  const bodyPart = {
    abdominals: muscles.abdominals.muscleLevel,
    traps: muscle.traps.muscleLevel,
    chest: muscle.chest.muscleLevel,
    shoulders: muscle.shoulders.muscleLevel,
    biceps: muscle.biceps.muscleLeve,
    forearms: muscle.forearms.muscleLeve,
    triceps: muscle.triceps.muscleLeve,
    obliques: muscle.obliques.muscleLeve,
    lats: muscle.lats.muscleLeve,
    lower_back: muscle.lower_back.muscleLeve,
    glutes: muscle.glutes.muscleLeve,
    hamsterings: muscle.hamsterings.muscleLeve,
    calves: muscle.calves.muscleLeve,
    quads: muscle.quads.muscleLeve,
  };

  const BottomSheetModalRef = useRef(null);
  const snapPoints = ["50%"];
  const [muscle, setmuscle] = useState("");

  useEffect(() => {
    if (muscle) handlePresentModal();
  }, [muscle]);

  const handlePresentModal = () => {
    BottomSheetModalRef.current?.present();
  };

  const handleSheetChanges = (index) => {
    if (index === -1) setmuscle("");
  };

  const bottomSheetContainer = (muscle) => {
    let labels = muscles.muscle.egzersizeHistory.map((egzersize) =>
      Date(egzersize.history).getDate()
    );
    let quantitiy = muscles.muscle.egzersizeHistory.map(
      (egzersize) => egzersize.quantitiy
    );
    let intensity = muscles.muscle.egzersizeHistory.map(
      (egzersize) => egzersize.intensity
    );

    return (
      <View style={styles.bottomSheetContainer}>
        <Chart
          muscleName={muscle}
          labels={labels}
          quantitiy={quantitiy}
          intensity={intensity}
        />
        <View style={styles.egzersize}>
          <Text style={styles.egzersizeTitle}>Triceps PushDown:</Text>
          <Text style={styles.egzersizeDetail}>
            <Text style={{ fontWeight: 600 }}>Set 1: Reps:</Text> 12
            <Text style={{ fontWeight: 500 }}> Weight: </Text>
            30kg
          </Text>
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <View style={styles.innerAreaTop}>
            <Body
              width={350}
              height={350}
              top={0}
              BodyPart={bodyPart}
              setmuscle={setmuscle}
            />
          </View>
          <View style={styles.innerAreaBottom}></View>
        </View>
        <BottomSheetModal
          ref={BottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
        >
          {bottomSheetContainer(muscle)}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: "space-around",
  },
  bottomSheetContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  egzersize: {
    alignItems: "flex-start",
    borderRadius: 16,
    width: Dimensions.get("window").width * 0.95,
    marginVertical: 20,
    backgroundColor: "#F7EBEB",
    padding: 15,
  },
  egzersizeTitle: {
    fontWeight: "bold",
    fontSize: 22,
  },
  egzersizeDetail: {
    fontSize: 16,
  },
});
export default HomeScreen;
