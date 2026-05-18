import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface CurrentPlanCardProps {
    onManagePlan: () => void;
    onUnsubscribe?: () => void;
    planName?: string;
    expiryDate?: string;
    price?: string;
}

const BenefitItem: React.FC<{ text: string, bgColor: string, textColor: string, checkColor: string }> = ({ text, bgColor, textColor, checkColor }) => (
    <View style={styles.benefitItem}>
        <View style={[styles.checkIconBg, { backgroundColor: bgColor }]}>
            <Ionicons name="checkmark" size={12} color={checkColor} />
        </View>
        <Text style={[styles.benefitText, { color: textColor }]}>{text}</Text>
    </View>
);

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
    onManagePlan,
    onUnsubscribe,
    planName = "Premium Plan",
    expiryDate = "Active Until Nov 30, 2025",
    price = "Rs. 29.99"
}) => {
    const planNameUpper = planName.toUpperCase();
    const isNewGold = planNameUpper.includes('NEW GOLD');
    const isGold = planNameUpper === 'GOLD' || (planNameUpper.includes('GOLD') && !isNewGold);
    const isPremium = planNameUpper.includes('PREMIUM') || planNameUpper.includes('PRO');
    const isLight = isNewGold || isGold;

    let cardGradient = ['#2563eb', '#1d4ed8'];
    let checkIconBgColor = '#10b981';
    let checkIconColor = '#fff';

    if (isNewGold) {
        cardGradient = ['#FEF9C3', '#FEF08A']; // Pale attractive gold
        checkIconBgColor = '#CA8A04'; // Shiny gold check
    } else if (isGold) {
        cardGradient = ['#FFFBEB', '#FEF3C7']; // Pale amber gold
        checkIconBgColor = '#D97706'; // Rich amber check
    } else if (isPremium) {
        cardGradient = ['#1e293b', '#0f172a'];
    }

    const textPrimary = isLight ? '#1e293b' : '#fff';
    const textSecondary = isLight ? '#475569' : 'rgba(255,255,255,0.9)';
    const textMuted = isLight ? '#64748b' : 'rgba(255,255,255,0.6)';
    const dividerBg = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    const badgeBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)';
    const badgeBorder = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
    const iconBg = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
    const headerIconColor = isLight ? checkIconBgColor : (isPremium ? "#fbbf24" : "#fff");

    return (
        <View style={styles.cardWrapper}>
            <LinearGradient
                colors={cardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.planCard}
            >
                <View style={styles.topRow}>
                    <View style={[styles.activeBadge, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
                        <View style={styles.activeDot} />
                        <Text style={[styles.activeLabel, { color: textPrimary }]}>Current Plan</Text>
                    </View>
                    <View style={[styles.planIconBg, { backgroundColor: iconBg }]}>
                        <Ionicons name={isPremium ? "diamond" : "flash"} size={20} color={headerIconColor} />
                    </View>
                </View>

                <View style={styles.mainInfo}>
                    <Text style={[styles.planTitle, { color: textPrimary }]}>{planName}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={[styles.price, { color: textPrimary }]}>{price}</Text>
                        <Text style={[styles.perPeriod, { color: textMuted }]}>/ month</Text>
                    </View>
                </View>

                <View style={styles.expiryRow}>
                    <Ionicons name="calendar-outline" size={14} color={textMuted} />
                    <Text style={[styles.expiryText, { color: textSecondary }]}>{expiryDate}</Text>
                </View>

                <View style={[styles.divider, { backgroundColor: dividerBg }]} />

                <View style={styles.benefitsGrid}>
                    <View style={styles.benefitCol}>
                        <BenefitItem text="Unlimited Ads" bgColor={checkIconBgColor} textColor={textSecondary} checkColor={checkIconColor} />
                        <BenefitItem text="Featured Labels" bgColor={checkIconBgColor} textColor={textSecondary} checkColor={checkIconColor} />
                        <BenefitItem text="Priority Support" bgColor={checkIconBgColor} textColor={textSecondary} checkColor={checkIconColor} />
                    </View>
                    <View style={styles.benefitCol}>
                        <BenefitItem text="Advanced Analytics" bgColor={checkIconBgColor} textColor={textSecondary} checkColor={checkIconColor} />
                        <BenefitItem text="Custom Branding" bgColor={checkIconBgColor} textColor={textSecondary} checkColor={checkIconColor} />
                        <BenefitItem text="Verified Badge" bgColor={checkIconBgColor} textColor={textSecondary} checkColor={checkIconColor} />
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.primaryAction}
                    onPress={onManagePlan}
                >
                    <Text style={styles.primaryActionText}>Manage Subscription</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>

                {onUnsubscribe && (
                    <TouchableOpacity
                        style={styles.secondaryAction}
                        onPress={onUnsubscribe}
                    >
                        <Text style={styles.secondaryActionText}>Cancel Subscription</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        marginBottom: 24,
    },
    planCard: {
        borderRadius: 5,
        padding: 24,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
        marginRight: 8,
    },
    activeLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    planIconBg: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainInfo: {
        marginBottom: 12,
    },
    planTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    perPeriod: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        marginLeft: 4,
        fontWeight: '600',
    },
    expiryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 24,
    },
    expiryText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 20,
    },
    benefitsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    benefitCol: {
        flex: 1,
        gap: 10,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkIconBg: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    benefitText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '600',
    },
    actions: {
        marginTop: 20,
        gap: 12,
        paddingHorizontal: 4,
    },
    primaryAction: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 5,
        gap: 10,
    },
    primaryActionText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    secondaryAction: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    secondaryActionText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '700',
    },
});

export default CurrentPlanCard;
