import React from "react";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text, StyleSheet } from "react-native";

const Chart = ({ muscleName, labels, intensity, quantitiy }) => {
  muscleName = muscleName.charAt(0).toUpperCase() + muscleName.slice(1);

  const handle = ({ value, getColor, index }) => {
    getColor() && "purple"
      ? console.log("quantitiy", labels[index], value)
      : console.log("intensity", labels[index], value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>{muscleName} Exercise History</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: quantitiy,
              color: () => "purple",
            },
            {
              data: intensity,
            },
          ],
        }}
        width={Dimensions.get("window").width * 0.95} // from react-native
        height={220}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "red",
          backgroundGradientFrom: "purple",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          borderRadius: 16,
        }}
        onDataPointClick={handle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartTitle: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Chart;
