import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdminBottomNav from "./components/AdminBottomNav";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import SimpleBarChart from "./components/SimpleBarChart";
import {
  AD_PERFORMANCE_DATA,
  ANALYTICS_SUMMARY,
  REVENUE_DATA,
  TOP_PERFORMING_ADS,
  TRAFFIC_SOURCES,
  USER_GROWTH_DATA,
} from "./data/adminAnalytics";

const { width } = Dimensions.get("window");

const TIME_FILTERS = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 3 Months",
  "Last Year",
];

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(TIME_FILTERS[1]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Transform data for charts
  const revenueChartData = REVENUE_DATA.map((item) => ({
    label: item.date,
    value: item.value,
  }));

  const userGrowthBarData = USER_GROWTH_DATA.map((item) => ({
    label: item.date,
    value: item.activeUsers,
    color: COLORS.primary,
    gradient: [COLORS.primary, "#2563EB"] as [string, string],
  }));

  const trafficPieData = TRAFFIC_SOURCES.map((item) => ({
    label: item.source,
    value: item.visits,
    color: item.color,
  }));

  const adPerformanceBarData = AD_PERFORMANCE_DATA.map((item, index) => {
    const colors = [
      [COLORS.primary, "#2563EB"],
      ["#10B981", "#059669"],
      ["#F59E0B", "#D97706"],
      ["#8B5CF6", "#7C3AED"],
      ["#EF4444", "#DC2626"],
    ];
    return {
      label: item.category,
      value: item.revenue,
      color: colors[index % colors.length][0],
      gradient: colors[index % colors.length] as [string, string],
    };
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons
            name="bar-chart-outline"
            size={22}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.subHeaderTitle}>Analytics</Text>
        </View>

        {/* Time Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {TIME_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedTimeFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedTimeFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedTimeFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Total Revenue"
            value={ANALYTICS_SUMMARY.totalRevenue.value}
            change={ANALYTICS_SUMMARY.totalRevenue.change}
            changeType={ANALYTICS_SUMMARY.totalRevenue.changeType}
            icon="cash-outline"
            color={COLORS.primary}
          />
          <SummaryCard
            title="Total Users"
            value={ANALYTICS_SUMMARY.totalUsers.value}
            change={ANALYTICS_SUMMARY.totalUsers.change}
            changeType={ANALYTICS_SUMMARY.totalUsers.changeType}
            icon="people-outline"
            color="#10B981"
          />
          <SummaryCard
            title="Conversion Rate"
            value={ANALYTICS_SUMMARY.conversionRate.value}
            change={ANALYTICS_SUMMARY.conversionRate.change}
            changeType={ANALYTICS_SUMMARY.conversionRate.changeType}
            icon="trending-up-outline"
            color="#8B5CF6"
          />
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue Trend</Text>
            <Ionicons name="information-circle-outline" size={18} color="#9CA3AF" />
          </View>
          <LineChart data={revenueChartData} color={COLORS.primary} />
        </View>

        {/* User Growth Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>User Growth</Text>
            <Ionicons name="people-outline" size={18} color="#9CA3AF" />
          </View>
          <SimpleBarChart data={userGrowthBarData} />
        </View>

        {/* Traffic Sources */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Traffic Sources</Text>
            <Ionicons name="globe-outline" size={18} color="#9CA3AF" />
          </View>
          <PieChart data={trafficPieData} size={220} />
        </View>

        {/* Ad Performance by Category */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Revenue by Category</Text>
            <Ionicons name="car-outline" size={18} color="#9CA3AF" />
          </View>
          <SimpleBarChart data={adPerformanceBarData} showValues={true} />
        </View>

        {/* Top Performing Ads */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Top Performing Ads</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Ad Title</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Views</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Clicks</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Revenue</Text>
            </View>
            {TOP_PERFORMING_ADS.map((ad, index) => (
              <View key={ad.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: "600" }]}>
                  {ad.title}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {ad.views.toLocaleString()}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {ad.clicks.toLocaleString()}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, color: COLORS.primary, fontWeight: "600" }]}>
                  ${(ad.revenue / 1000).toFixed(0)}K
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Additional Metrics */}
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Avg. Session Duration"
            value={ANALYTICS_SUMMARY.avgSessionDuration.value}
            change={ANALYTICS_SUMMARY.avgSessionDuration.change}
            changeType={ANALYTICS_SUMMARY.avgSessionDuration.changeType}
            icon="time-outline"
          />
          <MetricCard
            title="Bounce Rate"
            value={ANALYTICS_SUMMARY.bounceRate.value}
            change={ANALYTICS_SUMMARY.bounceRate.change}
            changeType={ANALYTICS_SUMMARY.bounceRate.changeType}
            icon="arrow-down-outline"
          />
        </View>
      </ScrollView>

      {/* Admin Bottom Nav */}
      <AdminBottomNav insetBottom={insets.bottom} />
    </View>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: string;
  color: string;
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryCardHeader}>
        <Text style={styles.summaryCardTitle}>{title}</Text>
        <View style={[styles.summaryCardIcon, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon as any} size={18} color={color} />
        </View>
      </View>
      <Text style={styles.summaryCardValue}>{value}</Text>
      <View style={styles.summaryCardFooter}>
        <Ionicons
          name={changeType === "up" ? "arrow-up" : "arrow-down"}
          size={12}
          color={changeType === "up" ? "#10B981" : "#EF4444"}
        />
        <Text
          style={[
            styles.summaryCardChange,
            { color: changeType === "up" ? "#10B981" : "#EF4444" },
          ]}
        >
          {change}
        </Text>
      </View>
    </View>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricCardHeader}>
        <Ionicons name={icon as any} size={20} color="#6B7280" />
        <Text style={styles.metricCardTitle}>{title}</Text>
      </View>
      <Text style={styles.metricCardValue}>{value}</Text>
      <View style={styles.metricCardFooter}>
        <Ionicons
          name={changeType === "up" ? "arrow-up" : "arrow-down"}
          size={10}
          color={changeType === "up" ? "#10B981" : "#EF4444"}
        />
        <Text
          style={[
            styles.metricCardChange,
            { color: changeType === "up" ? "#10B981" : "#EF4444" },
          ]}
        >
          {change}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subHeaderWrap: {
    backgroundColor: COLORS.background,
    paddingBottom: 12,
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subHeaderTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  filterScroll: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.text.muted,
  },
  filterChipTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  summaryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  summaryCardTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text.muted,
    flex: 1,
  },
  summaryCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  summaryCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  summaryCardChange: {
    fontSize: 11,
    fontWeight: "600",
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: 12,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableCell: {
    fontSize: 13,
    color: COLORS.text.secondary,
    textAlign: "left",
  },
  metricsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  metricCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  metricCardTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text.muted,
    flex: 1,
  },
  metricCardValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  metricCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricCardChange: {
    fontSize: 11,
    fontWeight: "600",
  },
});

