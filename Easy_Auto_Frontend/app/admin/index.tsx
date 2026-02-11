import Header from "@/components/Header";
import { Stack } from "expo-router";
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
import { ADMIN_DASHBOARD_DATA } from "@/src/admin/data/adminDashboard";
import COLORS from "@/constants/Colors";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
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
            <Header />

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
                {/* Statistics Cards */}
                <View style={styles.statsGrid}>
                    {ADMIN_DASHBOARD_DATA.stats.map((stat, index) => (
                        <StatCard key={index} {...stat} delay={index * 100} />
                    ))}
                </View>

                {/* Quick Actions */}
                <QuickActions />

                {/* Recent Activity */}
                <RecentActivity activities={ADMIN_DASHBOARD_DATA.recentActivities} />
            </ScrollView>

            {/* Admin Bottom Nav */}
            <AdminBottomNav insetBottom={insets.bottom} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
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
