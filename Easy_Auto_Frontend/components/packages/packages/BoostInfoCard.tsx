import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

const BoostInfoCard: React.FC = () => {
    return (
        <View style={styles.infoCard}>
            <View style={styles.iconContainer}>
                <Ionicons name="rocket-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.content}>
                <Text style={styles.infoTitle}>Boost Your Sales ⚡</Text>
                <Text style={styles.infoText}>
                    Select a premium package to list more vehicles and reach serious buyers instantly.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 5,
        marginBottom: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 5,
        backgroundColor: '#eff6ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b',
    },
    infoText: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 4,
        lineHeight: 18,
        fontWeight: '500',
    },
});

export default BoostInfoCard;
