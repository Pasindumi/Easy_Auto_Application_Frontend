import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from "../../theme";

interface CurrentPlanCardProps {
    onManagePlan: () => void;
    onUnsubscribe?: () => void;
    planName?: string;
    expiryDate?: string;
    price?: string;
}

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
    <View style={styles.benefitItem}>
        <Ionicons name="checkmark" size={16} color="#235CF8" />
        <Text style={styles.benefitText}>{text}</Text>
    </View>
);

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
    onManagePlan,
    onUnsubscribe,
    planName = "Premium Plan",
    expiryDate = "Active Until Nov 30, 2025",
    price = "$29.99"
}) => {
    return (
        <View style={styles.planCard}>
            <View style={styles.topRow}>
                <View style={styles.activeBadge}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeLabel}>Active</Text>
                </View>
                <View style={styles.crownIcon}>
                    <Ionicons name="diamond" size={20} color="#FF9800" />
                </View>
            </View>

            <Text style={styles.planTitle}>{planName}</Text>
            <View style={styles.expiryContainer}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.planSubtitle}>{expiryDate}</Text>
            </View>

            <View style={styles.priceRow}>
                <Text style={styles.price}>{price}</Text>
                {/* <Text style={styles.perMonth}>/month</Text> */}
            </View>

            {/* Benefits Box */}
            <View style={styles.benefitsBox}>
                <Text style={styles.benefitsTitle}>Plan Benefits</Text>

                <View style={styles.benefitsRow}>
                    <View>
                        <BenefitItem text="Unlimited Ads" />
                        <BenefitItem text="Featured Listings" />
                        <BenefitItem text="Custom Branding" />
                    </View>

                    <View>
                        <BenefitItem text="Priority support" />
                        <BenefitItem text="Advance analytics" />
                        <BenefitItem text="Customer Service" />
                    </View>
                </View>
            </View>

            {/* Buttons Row */}
            <View style={{ marginTop: 16, gap: 10 }}>
                {/* Manage Plan Button */}
                <TouchableOpacity
                    style={styles.manageButton}
                    onPress={onManagePlan}
                    activeOpacity={0.8}
                >
                    <Ionicons name="settings-outline" size={18} color="#fff" />
                    <Text style={styles.manageText}>Manage Plan</Text>
                </TouchableOpacity>

                {/* Unsubscribe Button */}
                {onUnsubscribe && (
                    <TouchableOpacity
                        style={[styles.manageButton, { backgroundColor: '#FEE2E2', shadowColor: '#EF4444' }]}
                        onPress={onUnsubscribe}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
                        <Text style={[styles.manageText, { color: '#EF4444' }]}>Unsubscribe</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    planCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    activeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#10B981',
    },
    crownIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF7ED',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expiryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    planTitle: {
        ...typography.heading,
        fontSize: 20,
        marginTop: 8,
    },
    planSubtitle: {
        ...typography.caption,
        marginLeft: 6,
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 8,
    },
    price: {
        fontSize: 28,
        fontWeight: '800',
        color: '#235CF8',
    },
    perMonth: {
        color: '#235CF8',
        marginLeft: 4,
    },
    benefitsBox: {
        backgroundColor: '#F1F6FF',
        borderRadius: 12,
        padding: 12,
        marginTop: 14,
    },
    benefitsTitle: {
        ...typography.subheading,
        fontSize: 14,
        color: '#235CF8',
        marginBottom: 8,
    },
    benefitsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    benefitText: {
        marginLeft: 6,
        fontSize: 12,
    },
    manageButton: {
        backgroundColor: '#235CF8',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#235CF8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    manageText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});

export default CurrentPlanCard;
