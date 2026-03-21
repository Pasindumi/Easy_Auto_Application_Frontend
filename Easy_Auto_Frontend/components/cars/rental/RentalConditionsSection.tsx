import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import COLORS from '@/constants/Colors';

interface RentalConditionsSectionProps {
    conditions: {
        minAge: string;
        mileageLimit: string;
        allowSmoking: boolean;
        allowPets: boolean;
        reqDeposit: boolean;
        otherConditions: string;
    };
    handleInputChange: (field: string, value: any) => void;
}

const RentalConditionsSection: React.FC<RentalConditionsSectionProps> = ({ conditions, handleInputChange }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rental Conditions</Text>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Min Age *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 21"
                        keyboardType="numeric"
                        value={conditions.minAge}
                        onChangeText={(val) => handleInputChange('minAge', val)}
                    />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Daily Mileage Limit (km) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 100"
                        keyboardType="numeric"
                        value={conditions.mileageLimit}
                        onChangeText={(val) => handleInputChange('mileageLimit', val)}
                    />
                </View>
            </View>

            <View style={styles.switchGroup}>
                <View style={styles.switchRow}>
                    <Text style={styles.label}>Allow Smoking</Text>
                    <Switch
                        value={conditions.allowSmoking}
                        onValueChange={(val) => handleInputChange('allowSmoking', val)}
                        trackColor={{ false: "#767577", true: COLORS.primary }}
                    />
                </View>
                <View style={styles.switchRow}>
                    <Text style={styles.label}>Allow Pets</Text>
                    <Switch
                        value={conditions.allowPets}
                        onValueChange={(val) => handleInputChange('allowPets', val)}
                        trackColor={{ false: "#767577", true: COLORS.primary }}
                    />
                </View>
                <View style={styles.switchRow}>
                    <Text style={styles.label}>Require Security Deposit</Text>
                    <Switch
                        value={conditions.reqDeposit}
                        onValueChange={(val) => handleInputChange('reqDeposit', val)}
                        trackColor={{ false: "#767577", true: COLORS.primary }}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Other Conditions / Instructions</Text>
                <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    placeholder="e.g. No off-roading, return clean..."
                    multiline
                    value={conditions.otherConditions}
                    onChangeText={(val) => handleInputChange('otherConditions', val)}
                />
            </View>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 15,
    },
    inputGroup: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        color: COLORS.text?.primary || '#333',
        marginBottom: 5,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.divider || '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#000',
    },
    switchGroup: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
});

export default RentalConditionsSection;
