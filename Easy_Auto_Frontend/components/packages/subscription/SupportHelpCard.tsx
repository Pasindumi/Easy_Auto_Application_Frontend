import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from "../../theme";

interface SupportHelpCardProps {
    onContactSupport: () => void;
}

const SupportHelpCard: React.FC<SupportHelpCardProps> = ({ onContactSupport }) => {
    return (
        <View style={styles.helpCard}>
            <View style={styles.helpIconContainer}>
                <Ionicons name="help-circle" size={32} color="#235CF8" />
            </View>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
                Have questions about billing or subscriptions? Our support team
                is here to help.
            </Text>

            <TouchableOpacity
                style={styles.supportButton}
                onPress={onContactSupport}
                activeOpacity={0.8}
            >
                <Text style={styles.supportText}>Contact Support</Text>
                <Ionicons name="arrow-forward" size={18} color="#235CF8" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    helpCard: {
        backgroundColor: '#F0F7FF',
        padding: 20,
        borderRadius: 18,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    helpIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    helpTitle: {
        ...typography.subheading,
        marginBottom: 8,
        textAlign: 'center',
    },
    helpText: {
        ...typography.body,
        marginBottom: 16,
        textAlign: 'center',
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    supportText: {
        color: '#235CF8',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default SupportHelpCard;
