import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

const { width } = Dimensions.get("window");
const CHART_HEIGHT = 180;
const CHART_PADDING = 40;
const POINT_RADIUS = 4;

export default function LineChart({
  data,
  color = "#3B82F6",
  height = CHART_HEIGHT,
  showGrid = true,
}: LineChartProps) {
  const chartWidth = width - 64 - CHART_PADDING * 2;
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const valueRange = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y =
      height -
      CHART_PADDING -
      ((item.value - minValue) / valueRange) * (height - CHART_PADDING * 2);
    return { x, y, value: item.value };
  });

  const polylinePoints = points.map(p => `${p.x + CHART_PADDING},${p.y}`).join(" ");

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { height }]}>
        <Svg width={chartWidth + CHART_PADDING * 2} height={height}>
          {/* Grid lines */}
          {showGrid &&
            [0, 0.33, 0.66, 1].map((ratio, index) => {
              const y = CHART_PADDING + ratio * (height - CHART_PADDING * 2);
              return (
                <Line
                  key={index}
                  x1={CHART_PADDING}
                  y1={y}
                  x2={chartWidth + CHART_PADDING}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              );
            })}

          {/* Line */}
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x + CHART_PADDING}
              cy={point.y}
              r={POINT_RADIUS}
              fill={color}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Svg>
      </View>

      {/* Labels */}
      <View style={styles.labelsContainer}>
        {data.map((item, index) => (
          <Text key={index} style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  chartWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: CHART_PADDING,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
    flex: 1,
    textAlign: "center",
  },
});

