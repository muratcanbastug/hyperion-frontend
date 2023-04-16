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

import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

const HomeScreen = () => {
  // Dummy data for test
  const level = {
    newest: 1,
    recent: 2,
    oldest: 3,
  };

  const bodyPart = {
    abdominals: level.oldest,
    traps: level.newest,
    chest: level.newest,
    shoulders: level.oldest,
    biceps: level.oldest,
    forearms: level.oldest,
    triceps: level.recent,
    obliques: level.recent,
    lats: level.oldest,
    lower_back: level.oldest,
    glutes: level.oldest,
    hamsterings: level.newest,
    calves: level.oldest,
    quads: level.oldest,
  };

  const egzersizeHistory = {
    day1: {
      history: 1,
      egzersizes: {
        egzersize1: {
          egzersizeId: 173,
          sets: {
            set1: {
              repetitions: 12,
              weight: 30,
            },
            set2: {
              repetitions: 10,
              weight: 35,
            },
            set3: {
              repetitions: 8,
              weight: 40,
            },
          },
        },
        egzersize2: {
          egzersizeId: 175,
          sets: {
            set1: {
              repetitions: 12,
              weight: 30,
            },
            set2: {
              repetitions: 10,
              weight: 35,
            },
            set3: {
              repetitions: 8,
              weight: 40,
            },
            set4: {
              repetitions: 8,
              weight: 40,
            },
          },
        },
        egzersize3: {
          egzersizeId: 173,
          sets: {
            set1: {
              repetitions: 12,
              weight: 30,
            },
            set2: {
              repetitions: 10,
              weight: 35,
            },
            set3: {
              repetitions: 8,
              weight: 40,
            },
          },
        },
      },
    },
    day2: {
      history: 7,
      egzersizes: {
        egzersize1: {
          egzersizeId: 173,
          sets: {
            set1: {
              repetitions: 12,
              weight: 30,
            },
            set2: {
              repetitions: 10,
              weight: 35,
            },
            set3: {
              repetitions: 8,
              weight: 40,
            },
          },
        },
        egzersize2: {
          egzersizeId: 175,
          sets: {
            set1: {
              repetitions: 12,
              weight: 30,
            },
            set2: {
              repetitions: 10,
              weight: 35,
            },
            set3: {
              repetitions: 8,
              weight: 40,
            },
            set4: {
              repetitions: 8,
              weight: 40,
            },
          },
        },
        egzersize3: {
          egzersizeId: 173,
          sets: {
            set1: {
              repetitions: 12,
              weight: 30,
            },
            set2: {
              repetitions: 10,
              weight: 35,
            },
            set3: {
              repetitions: 8,
              weight: 40,
            },
          },
        },
      },
    },
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
    let labels = [1, 5, 8, 9, 10, 11, 12, 13, 14, 15];
    let quantitiy = [10, 10, 70, 12, 18, 21, 22, 24, 28, 29];
    let intensity = [23, 25, 13, 18, 58, 6, 7, 8, 11, 48];

    // for (let day in egzersizeHistory) {
    //   labels.push(egzersizeHistory[day].history);
    // }
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
              Level={level}
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
