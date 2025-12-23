import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CarFormState } from '../../../types/sell-car.types';

interface Props {
    carDetails: CarFormState;
    handleInputChange: (field: string, value: string | boolean) => void;
}

const CarDetailsSection: React.FC<Props> = ({ carDetails, handleInputChange }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Details</Text>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <Text style={styles.label}>Brand</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Toyota"
                        value={carDetails.brand}
                        onChangeText={(value) => handleInputChange('brand', value)}
                    />
                </View>

                <View style={styles.formHalf}>
                    <Text style={styles.label}>Model</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Yaris Cross"
                        value={carDetails.model}
                        onChangeText={(value) => handleInputChange('model', value)}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <Text style={styles.label}>Year</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="2025"
                        value={carDetails.year}
                        onChangeText={(value) => handleInputChange('year', value)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.formHalf}>
                    <Text style={styles.label}>Mileage</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="75,000Km"
                        value={carDetails.mileage}
                        onChangeText={(value) => handleInputChange('mileage', value)}
                    />
                </View>
            </View>

            <Text style={styles.label}>Transmission :</Text>
            <TextInput
                style={styles.input}
                placeholder="Automatic"
                value={carDetails.transmission}
                onChangeText={(value) => handleInputChange('transmission', value)}
            />

            <Text style={styles.label}>Fuel Type:</Text>
            <TextInput
                style={styles.input}
                placeholder="Petrol/Hybrid"
                value={carDetails.fuelType}
                onChangeText={(value) => handleInputChange('fuelType', value)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    section: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
    formRow: { flexDirection: 'row', gap: 12 },
    formHalf: { flex: 1 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: 'white', marginBottom: 16 },
});

export default CarDetailsSection;
