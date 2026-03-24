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
    sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary, marginBottom: 16 },
    inputGroup: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        backgroundColor: '#F9FAFB',
        color: COLORS.text.primary
    },
    switchGroup: {
        marginBottom: 20,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
});

export default RentalConditionsSection;
