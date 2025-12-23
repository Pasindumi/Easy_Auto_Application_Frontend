import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BoostInfoCard: React.FC = () => {
    return (
        <View style={styles.infoCard}>
            <Ionicons name="stats-chart" size={18} color="#235CF8" />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.infoTitle}>Boost Your Visibility</Text>
                <Text style={styles.infoText}>
                    List more vehicles and sell faster with our premium boost packages
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#EEF4FF',
        padding: 14,
        borderRadius: 12,
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    infoText: {
        fontSize: 12,
        color: '#555',
        marginTop: 2,
    },
});

export default BoostInfoCard;
