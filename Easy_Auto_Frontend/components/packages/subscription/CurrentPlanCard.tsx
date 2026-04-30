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

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
    <View style={styles.benefitItem}>
        <View style={styles.checkIconBg}>
            <Ionicons name="checkmark" size={12} color="#fff" />
        </View>
        <Text style={styles.benefitText}>{text}</Text>
    </View>
);

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
    onManagePlan,
    onUnsubscribe,
    planName = "Premium Plan",
    expiryDate = "Active Until Nov 30, 2025",
    price = "Rs. 29.99"
}) => {
    const isPremium = planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('pro');

    return (
        <View style={styles.cardWrapper}>
            <LinearGradient
                colors={isPremium ? ['#1e293b', '#0f172a'] : ['#2563eb', '#1d4ed8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.planCard}
            >
                <View style={styles.topRow}>
                    <View style={styles.activeBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeLabel}>Current Plan</Text>
                    </View>
                    <View style={styles.planIconBg}>
                        <Ionicons name={isPremium ? "diamond" : "flash"} size={20} color={isPremium ? "#fbbf24" : "#fff"} />
                    </View>
                </View>

                <View style={styles.mainInfo}>
                    <Text style={styles.planTitle}>{planName}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{price}</Text>
                        <Text style={styles.perPeriod}>/ month</Text>
                    </View>
                </View>

                <View style={styles.expiryRow}>
                    <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.expiryText}>{expiryDate}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.benefitsGrid}>
                    <View style={styles.benefitCol}>
                        <BenefitItem text="Unlimited Ads" />
                        <BenefitItem text="Featured Labels" />
                        <BenefitItem text="Priority Support" />
                    </View>
                    <View style={styles.benefitCol}>
                        <BenefitItem text="Advanced Analytics" />
                        <BenefitItem text="Custom Branding" />
                        <BenefitItem text="Verified Badge" />
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
        paddingVertical: 16,
        borderRadius: 5,
        gap: 10,
    },
    primaryActionText: {
        color: '#fff',
        fontSize: 16,
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
