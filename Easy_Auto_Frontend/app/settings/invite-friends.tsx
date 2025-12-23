import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function InviteFriendsScreen() {
    const router = useRouter();

    const handleShare = async () => {
        try {
            await Share.share({
                message:
                    "Check out Easy Auto! The best place to buy and sell cars. Download now: https://easyauto.com/download",
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Invite Friends" />

            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: COLORS.primaryLight }]}>
                    <Ionicons name="gift-outline" size={80} color={COLORS.primary} />
                </View>

                <Text style={styles.title}>Invite Friends & Earn Rewards</Text>
                <Text style={styles.subtitle}>
                    Share the app with your friends and get exclusive premium features when they sign up!
                </Text>

                <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Your Referral Code</Text>
                    <TouchableOpacity style={styles.codeBox} activeOpacity={0.8}>
                        <Text style={styles.code}>DILMIN2024</Text>
                        <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShare}
                    activeOpacity={0.8}
                >
                    <Text style={styles.shareText}>Invite Friends</Text>
                    <Ionicons name="share-outline" size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.text.primary,
        textAlign: "center",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.text.secondary,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 40,
    },
    codeContainer: {
        width: "100%",
        marginBottom: 24,
    },
    codeLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 10,
        textAlign: "center",
        color: COLORS.text.muted,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    codeBox: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.divider,
        borderRadius: 16,
        padding: 18,
        alignItems: "center",
        justifyContent: "space-between",
        borderStyle: "dashed",
    },
    code: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.primary,
        letterSpacing: 2,
    },
    shareButton: {
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: "100%",
        gap: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    shareText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.white,
    },
});
