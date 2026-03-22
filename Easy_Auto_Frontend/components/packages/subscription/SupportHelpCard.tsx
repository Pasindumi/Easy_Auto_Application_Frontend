import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface SupportHelpCardProps {
    onContactSupport: () => void;
}

const SupportHelpCard: React.FC<SupportHelpCardProps> = ({ onContactSupport }) => {
    return (
        <View style={styles.helpCard}>
            <View style={styles.helpIconContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={28} color={COLORS.primary} />
            </View>
            <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>Need Assistance?</Text>
                <Text style={styles.helpText}>
                    Have questions about billing or plans? Our expert support team is ready to help 24/7.
                </Text>

                <TouchableOpacity
                    style={styles.supportButton}
                    onPress={onContactSupport}
                    activeOpacity={0.8}
                >
                    <Text style={styles.supportText}>TALK TO AN EXPERT</Text>
                    <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    helpCard: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 24,
        marginBottom: 40,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 20,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    helpIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpContent: {
        flex: 1,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    helpText: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
        marginBottom: 20,
        fontWeight: '500',
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    supportText: {
        color: COLORS.primary,
        fontWeight: '800',
        fontSize: 12,
        letterSpacing: 0.5,
    },
});

export default SupportHelpCard;
