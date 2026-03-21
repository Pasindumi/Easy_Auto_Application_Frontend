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
                <Ionicons name="chatbubble-ellipses-outline" size={32} color={COLORS.primary} />
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
                    <Text style={styles.supportText}>Talk to an Expert</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
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
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    helpIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpContent: {
        flex: 1,
    },
    helpTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 6,
    },
    helpText: {
        fontSize: 14,
        color: COLORS.text.muted,
        lineHeight: 20,
        marginBottom: 16,
        fontWeight: '500',
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    supportText: {
        color: COLORS.primary,
        fontWeight: '800',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default SupportHelpCard;
