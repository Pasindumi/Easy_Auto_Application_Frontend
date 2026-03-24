import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import COLORS from '@/constants/Colors';

interface RentalPricingSectionProps {
    pricing: {
        pricePerDay: string;
        pricePerWeek?: string;
        pricePerMonth?: string;
        extraMileageFee?: string;
        securityDeposit?: string;
    };
    handleInputChange: (field: string, value: string) => void;
}

const RentalPricingSection: React.FC<RentalPricingSectionProps> = ({ pricing, handleInputChange }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing Details</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Price Per Day (LKR) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 5000"
                    keyboardType="numeric"
                    value={pricing.pricePerDay}
                    onChangeText={(val) => handleInputChange('pricePerDay', val)}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.label}>Price Per Week (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 30000"
                        keyboardType="numeric"
                        value={pricing.pricePerWeek}
                        onChangeText={(val) => handleInputChange('pricePerWeek', val)}
                    />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Price Per Month (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 100000"
                        keyboardType="numeric"
                        value={pricing.pricePerMonth}
                        onChangeText={(val) => handleInputChange('pricePerMonth', val)}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Extra Mileage Fee (per km) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 50"
                    keyboardType="numeric"
                    value={pricing.extraMileageFee}
                    onChangeText={(val) => handleInputChange('extraMileageFee', val)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Security Deposit (LKR) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 20000"
                    keyboardType="numeric"
                    value={pricing.securityDeposit}
                    onChangeText={(val) => handleInputChange('securityDeposit', val)}
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
});

export default RentalPricingSection;
