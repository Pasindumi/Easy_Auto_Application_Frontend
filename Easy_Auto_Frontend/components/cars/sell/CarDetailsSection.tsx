import SelectField from '@/components/ui/SelectField';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CarFormState } from '../../../types/sell-car.types';

interface Props {
    carDetails: CarFormState;
    handleInputChange: (field: string, value: string | boolean) => void;
}

const CarDetailsSection: React.FC<Props> = ({ carDetails, handleInputChange }) => {

    // Mock Data for Dropdowns - In a real app, these could come from an API
    const conditions = ['Brand New', 'Used', 'Reconditioned', 'Import'].map(c => ({ label: c, value: c }));
    const brands = ['Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mahindra', 'Mercedes', 'Nissan', 'Toyota', 'Suzuki'].map(b => ({ label: b, value: b }));
    const models = ['XUV', 'XUV500', 'Yaris', 'Corolla', 'Civic', 'Mustang'].map(m => ({ label: m, value: m })); // Simplified
    const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(f => ({ label: f, value: f }));
    const transmissions = ['Automatic', 'Manual', 'Tiptronic'].map(t => ({ label: t, value: t }));
    const bodyTypes = ['Saloon', 'Hatchback', 'SUV', 'Convertible', 'Coupe', 'Van', 'Wagon'].map(b => ({ label: b, value: b }));

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Details</Text>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <SelectField
                        label="Condition"
                        value={carDetails.condition}
                        options={conditions}
                        onSelect={(val) => handleInputChange('condition', val)}
                    />
                </View>
                <View style={styles.formHalf}>
                    <SelectField
                        label="Brand"
                        value={carDetails.brand}
                        options={brands}
                        onSelect={(val) => handleInputChange('brand', val)}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <SelectField
                        label="Model"
                        value={carDetails.model}
                        options={models}
                        onSelect={(val) => handleInputChange('model', val)}
                    />
                </View>
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
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <Text style={styles.label}>Mileage (km)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="75,000"
                        value={carDetails.mileage}
                        onChangeText={(value) => handleInputChange('mileage', value)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.formHalf}>
                    <Text style={styles.label}>Engine (cc)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="1500"
                        value={carDetails.engineCapacity || ''} // Handle potentially undefined if type not updated yet
                        onChangeText={(value) => handleInputChange('engineCapacity', value)}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <SelectField
                label="Transmission"
                value={carDetails.transmission}
                options={transmissions}
                onSelect={(val) => handleInputChange('transmission', val)}
            />

            <SelectField
                label="Fuel Type"
                value={carDetails.fuelType}
                options={fuelTypes}
                onSelect={(val) => handleInputChange('fuelType', val)}
            />

            <SelectField
                label="Body Type"
                value={carDetails.bodyType || ''}
                options={bodyTypes}
                onSelect={(val) => handleInputChange('bodyType', val)}
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
