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
                <Text style={styles.sectionTitle}>Availability Calendar</Text>
            </View>
            <Text style={styles.infoText}>
                Set your vehicle's availability. By default, it's marked as available for all dates.
            </Text>

            <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>
                    [ Calendar Integration Placeholder ]
                </Text>
                <Text style={styles.subText}>
                    You can manage specific blackout dates once the ad is published from the 'Manage Ads' dashboard.
                </Text>
            </View>

            <TouchableOpacity style={styles.btnSecondary}>
                <Text style={styles.btnText}>Set Available Dates</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: COLORS.white,
        padding: 20,
        marginVertical: 10,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 20,
        lineHeight: 18,
    },
    placeholderContainer: {
        padding: 30,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
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
