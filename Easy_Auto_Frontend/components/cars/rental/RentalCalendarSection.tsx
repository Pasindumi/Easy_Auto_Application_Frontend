import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';

interface RentalCalendarSectionProps {
    availability: any[]; // Placeholder for complex state
    handleAvailabilityUpdate: (data: any) => void;
}

const RentalCalendarSection: React.FC<RentalCalendarSectionProps> = ({ availability, handleAvailabilityUpdate }) => {
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Ionicons name="calendar-outline" size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
                <Text style={styles.sectionTitle}>Availability & Blackout Dates</Text>
            </View>
            <Text style={styles.infoText}>
                By default, your vehicle is marked as available from the publish date until the ad expires.
                You only need to set 'Blackout Dates' if there are specific days the vehicle is unavailable.
            </Text>

            <View style={styles.placeholderContainer}>
                <Ionicons name="shield-checkmark-outline" size={40} color="#E2E8F0" style={{ marginBottom: 12 }} />
                <Text style={styles.placeholderText}>
                    Available by Default
                </Text>
                <Text style={styles.subText}>
                    You can manage specific blackout (unavailable) dates below or once the ad is published.
                </Text>
            </View>

            <TouchableOpacity style={styles.btnSecondary}>
                <Text style={styles.btnText}>Set Blackout (Unavailable) Dates</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text.primary,
    },
    infoText: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginBottom: 20,
        lineHeight: 18,
    },
    placeholderContainer: {
        padding: 30,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#999',
        marginBottom: 10,
    },
    subText: {
        fontSize: 11,
        color: '#aaa',
        textAlign: 'center',
    },
    btnSecondary: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnText: {
        color: COLORS.primary,
        fontWeight: '600',
    }
});

export default RentalCalendarSection;
