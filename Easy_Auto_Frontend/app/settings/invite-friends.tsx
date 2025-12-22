import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
            <Header />
            <View style={localStyles.headerWrap}>
                <View style={localStyles.header}>
                    <View style={localStyles.headerLeft}>
                        <Ionicons name="people-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
                        <Text style={localStyles.headerTitle}>Invite Friends</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="gift-outline" size={80} color="#235CF8" />
                </View>

                <Text style={styles.title}>Invite Friends & Earn Rewards</Text>
                <Text style={styles.subtitle}>
                    Share the app with your friends and get exclusive premium features when they sign up!
                </Text>

                <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Your Referral Code</Text>
                    <TouchableOpacity style={styles.codeBox} activeOpacity={0.8}>
                        <Text style={styles.code}>DILMIN2024</Text>
                        <Ionicons name="copy-outline" size={20} color="#235CF8" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShare}
                    activeOpacity={0.8}
                >
                    <Text style={styles.shareText}>Invite Friends</Text>
                    <Ionicons name="share-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
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
        backgroundColor: "#EFF6FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 40,
        lineHeight: 24,
    },
    codeContainer: {
        width: "100%",
        marginBottom: 24,
    },
    codeLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4B5563",
        marginBottom: 8,
        textAlign: "center",
    },
    codeBox: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        justifyContent: "space-between",
        borderStyle: "dashed",
    },
    code: {
        fontSize: 18,
        fontWeight: "700",
        color: "#235CF8",
        letterSpacing: 1,
    },
    shareButton: {
        backgroundColor: "#235CF8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: "100%",
        gap: 8,
    },
    shareText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },
});

const localStyles = StyleSheet.create({
    headerWrap: { backgroundColor: '#F9FAFB' },
    header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
