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
    Clipboard,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InviteFriendsScreen() {
    const router = useRouter();

    const scale = useSharedValue(1);
    const codeScale = useSharedValue(1);

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const codeBoxStyle = useAnimatedStyle(() => ({
        transform: [{ scale: codeScale.value }],
    }));

    const onPressIn = (sv: any) => {
        sv.value = withSpring(0.96);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const onPressOut = (sv: any) => {
        sv.value = withSpring(1);
    };

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

    const copyToClipboard = () => {
        Clipboard.setString("DILMIN2024");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Copied!", "Referral code copied to clipboard.");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Invite Friends" />

            <View style={styles.content}>
                {/* ---------- FOCAL POINT ---------- */}
                <View style={styles.focalContainer}>
                    <View style={styles.focalGlow} />
                    <LinearGradient
                        colors={['#FDF2F8', '#FFF']}
                        style={styles.iconCircle}
                    >
                        <Ionicons name="gift" size={80} color={COLORS.primary} />
                    </LinearGradient>
                </View>

                <View style={styles.textStack}>
                    <Text style={styles.title}>Advocate & Earn</Text>
                    <Text style={styles.subtitle}>
                        Bring your friends to the premium car ecosystem and unlock exclusive features for every verified referral.
                    </Text>
                </View>

                {/* ---------- SURFACE INTEGRATED DATA ---------- */}
                {/* Progress Row */}
                <View style={[styles.rewardSection, { paddingTop: 8 }]}>
                    <View style={styles.rewardHeader}>
                        <Text style={styles.rewardTitle}>Your Referral Progress</Text>
                        <Text style={styles.rewardCount}>2 / 5 Friends</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={[COLORS.primary, '#6366F1']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: '40%' }]}
                        />
                    </View>
                    <Text style={styles.rewardHint}>Invite 3 more friends to unlock <Text style={styles.accentText}>Premium Badge</Text></Text>
                </View>

                {/* Referral Code Row */}
                <View style={styles.referralSection}>
                    <Text style={styles.codeLabel}>EXCLSUIVE REFERRAL CODE</Text>
                    <Animated.View style={codeBoxStyle}>
                        <TouchableOpacity
                            style={styles.codeRow}
                            activeOpacity={0.9}
                            onPressIn={() => onPressIn(codeScale)}
                            onPressOut={() => onPressOut(codeScale)}
                            onPress={copyToClipboard}
                        >
                            <Text style={styles.codeText}>DILMIN2024</Text>
                            <View style={styles.copyBadge}>
                                <Ionicons name="copy" size={14} color={COLORS.primary} />
                                <Text style={styles.copyBadgeText}>COPY</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Quick Share Grid */}
                <View style={styles.shareGridSection}>
                    <Text style={styles.codeLabel}>QUICK SHARE CHANNEL</Text>
                    <View style={styles.shareGrid}>
                        <ShareTile icon="logo-whatsapp" color="#25D366" label="WhatsApp" onPress={handleShare} />
                        <ShareTile icon="logo-facebook" color="#1877F2" label="Facebook" onPress={handleShare} />
                        <ShareTile icon="chatbubble" color="#0EA5E9" label="More" onPress={handleShare} />
                    </View>
                </View>

                <View style={styles.perksList}>
                    <PerkItem icon="flash" text="Priority Ad Approval" />
                    <PerkItem icon="star" text="Featured Badge" />
                </View>

                {/* ---------- PRIMARY ACTION ---------- */}
                <Animated.View style={[styles.shareContainer, buttonStyle]}>
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPressIn={() => onPressIn(scale)}
                        onPressOut={() => onPressOut(scale)}
                        onPress={handleShare}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, '#1E3A8A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            <Ionicons name="share-social" size={20} color={COLORS.white} />
                            <Text style={styles.shareText}>Share Invite Link</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

function ShareTile({ icon, color, label, onPress }: { icon: any; color: string; label: string; onPress: () => void }) {
    const tileScale = useSharedValue(1);
    const tileStyle = useAnimatedStyle(() => ({
        transform: [{ scale: tileScale.value }],
    }));

    return (
        <Animated.View style={[styles.shareTileContainer, tileStyle]}>
            <TouchableOpacity
                style={styles.shareTile}
                onPressIn={() => { tileScale.value = withSpring(0.92); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                onPressOut={() => { tileScale.value = withSpring(1); }}
                onPress={onPress}
            >
                <View style={styles.tileIconBox}>
                    <Ionicons name={icon} size={28} color={color} />
                </View>
                <Text style={styles.tileLabel}>{label}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

function PerkItem({ icon, text }: { icon: any; text: string }) {
    return (
        <View style={styles.perkItem}>
            <View style={styles.perkIconBox}>
                <Ionicons name={icon} size={14} color={COLORS.primary} />
            </View>
            <Text style={styles.perkText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        paddingTop: 32,
    },
    focalContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    focalGlow: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        opacity: 0.5,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    textStack: {
        alignItems: 'center',
        paddingHorizontal: 40,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "900",
        color: '#1E293B',
        textAlign: "center",
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: "center",
        lineHeight: 22,
        fontWeight: '500',
    },
    rewardSection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginBottom: 24,
    },
    rewardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    rewardTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#1E293B',
    },
    rewardCount: {
        fontSize: 12,
        fontWeight: '900',
        color: COLORS.primary,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    rewardHint: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
    },
    accentText: {
        color: COLORS.primary,
        fontWeight: '800',
    },
    referralSection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginBottom: 24,
    },
    codeLabel: {
        fontSize: 10,
        fontWeight: "800",
        marginBottom: 10,
        color: '#94A3B8',
        letterSpacing: 1,
    },
    codeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    codeText: {
        fontSize: 20,
        fontWeight: "900",
        color: '#1E293B',
        letterSpacing: 2,
    },
    copyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    copyBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: COLORS.primary,
    },
    shareGridSection: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginBottom: 32,
    },
    shareGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    shareTileContainer: {
        flex: 1,
    },
    shareTile: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tileIconBox: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    tileLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
    },
    perksList: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    perkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    perkIconBox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    perkText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#475569',
    },
    shareContainer: {
        width: '100%',
        paddingHorizontal: 24,
        marginTop: 12,
        marginBottom: 20,
    },
    shareButton: {
        borderRadius: 16,
        height: 56,
        overflow: 'hidden',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonGradient: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    shareText: {
        fontSize: 16,
        fontWeight: "900",
        color: COLORS.white,
        letterSpacing: 0.5,
    },
});
