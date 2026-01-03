import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  showLabels?: boolean;
}

const DEFAULT_SIZE = 200;
const STROKE_WIDTH = 40;
const CENTER = DEFAULT_SIZE / 2;
const RADIUS = (DEFAULT_SIZE - STROKE_WIDTH) / 2;

export default function PieChart({
  data,
  size = DEFAULT_SIZE,
  showLabels = true,
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // Start from top

  const paths = data.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    // Calculate arc path
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = CENTER + RADIUS * Math.cos(startAngleRad);
    const y1 = CENTER + RADIUS * Math.sin(startAngleRad);
    const x2 = CENTER + RADIUS * Math.cos(endAngleRad);
    const y2 = CENTER + RADIUS * Math.sin(endAngleRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${CENTER} ${CENTER}`,
      `L ${x1} ${y1}`,
      `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    currentAngle = endAngle;

    return { pathData, color: item.color, percentage, label: item.label };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <G>
            {paths.map((path, index) => (
              <Path
                key={index}
                d={path.pathData}
                fill={path.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </G>
        </Svg>
      </View>

      {showLabels && (
        <View style={styles.legend}>
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>{percentage}%</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    marginTop: 24,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  legendValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
});
