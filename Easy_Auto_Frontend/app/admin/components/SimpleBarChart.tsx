import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

interface BarChartData {
  label: string;
  value: number;
  color: string;
  gradient: [string, string];
}

interface SimpleBarChartProps {
  data: BarChartData[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
}

const { width } = Dimensions.get("window");
const CHART_HEIGHT = 200;
const BAR_SPACING = 8;

export default function SimpleBarChart({
  data,
  maxValue,
  height = CHART_HEIGHT,
  showValues = true,
}: SimpleBarChartProps) {
  const chartMaxValue = maxValue || Math.max(...data.map((d) => d.value));
  const chartWidth = width - 64; // Account for padding
  const barWidth = (chartWidth - (data.length - 1) * BAR_SPACING) / data.length;

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { height }]}>
        {data.map((item, index) => {
          const barHeight = (item.value / chartMaxValue) * height;
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={[styles.barContainer, { height }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: barWidth,
                      height: barHeight,
                      backgroundColor: item.color,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={item.gradient}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              </View>
              {showValues && (
                <Text style={styles.valueLabel} numberOfLines={1}>
                  {item.value > 1000
                    ? `${(item.value / 1000).toFixed(1)}K`
                    : item.value}
                </Text>
              )}
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: BAR_SPACING / 2,
  },
  barContainer: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    borderRadius: 8,
    minHeight: 4,
  },
  valueLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 4,
    textAlign: "center",
  },
});

