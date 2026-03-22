import Header from "@/components/Header";
import BrandedRefreshOverlay from "@/components/ui/BrandedRefreshOverlay";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdminBottomNav from "@/src/admin/components/AdminBottomNav";
import QuickActions from "@/src/admin/components/QuickActions";
import RecentActivity from "@/src/admin/components/RecentActivity";
import StatCard from "@/src/admin/components/StatCard";
import { DASHBOARD_STATS, QUICK_ACTIONS, RECENT_ACTIVITIES } from "@/src/admin/data/adminDashboard";
import COLORS from "@/constants/Colors";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simulate refresh
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header title="Admin Dashboard" />

            <BrandedRefreshOverlay refreshing={refreshing} top={100} />
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
                        tintColor="transparent"
                        colors={["transparent"]}
                        progressBackgroundColor="transparent"
                    />
                }
            >
                {/* Statistics Cards */}
                <View style={styles.statsGrid}>
                    <StatCard
                        delay={0}
                        title="Active Listings"
                        value={DASHBOARD_STATS.totalAds.value}
                        label={DASHBOARD_STATS.totalAds.label}
                        iconName="car"
                        trend={DASHBOARD_STATS.totalAds.trend}
                        trendValue={DASHBOARD_STATS.totalAds.trendValue}
                    />
                    <StatCard
                        delay={100}
                        title="Total Income"
                        value={DASHBOARD_STATS.totalIncome.value}
                        label={DASHBOARD_STATS.totalIncome.label}
                        iconName="cash"
                        trend={DASHBOARD_STATS.totalIncome.trend}
                        trendValue={DASHBOARD_STATS.totalIncome.trendValue}
                    />
                    <StatCard
                        delay={200}
                        title="Users"
                        value={DASHBOARD_STATS.totalUsers.value}
                        label={DASHBOARD_STATS.totalUsers.label}
                        iconName="people"
                        trend={DASHBOARD_STATS.totalUsers.trend}
                        trendValue={DASHBOARD_STATS.totalUsers.trendValue}
                    />
                    <StatCard
                        delay={300}
                        title="Reports"
                        value={DASHBOARD_STATS.reports.value}
                        label={DASHBOARD_STATS.reports.label}
                        iconName="alert-circle"
                        trend={DASHBOARD_STATS.reports.trend}
                        trendValue={DASHBOARD_STATS.reports.trendValue}
                    />
                </View>

                {/* Quick Actions */}
                <QuickActions
                    actions={QUICK_ACTIONS}
                    onActionPress={(action) => router.push(action as any)}
                />

                {/* Recent Activity */}
                <RecentActivity
                    activities={RECENT_ACTIVITIES}
                    onViewAll={() => console.log("View All")}
                />
            </ScrollView>

            {/* Admin Bottom Nav */}
            <AdminBottomNav insetBottom={insets.bottom} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.admin.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 16,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        gap: 12,
    },
});
