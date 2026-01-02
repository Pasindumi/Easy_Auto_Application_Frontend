import SelectField from '@/components/ui/SelectField';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CarFormState } from '../../../types/sell-car.types';

interface Props {
    carDetails: CarFormState;
    handleInputChange: (field: string, value: string | boolean) => void;
    vehicleType?: string;
}

const CarDetailsSection: React.FC<Props> = ({ carDetails, handleInputChange, vehicleType = 'Car' }) => {

    // Data for Dropdowns based on Vehicle Type
    const getBrands = (type: string) => {
        switch (type) {
            case 'Motorbike':
                return ['Honda', 'Yamaha', 'Suzuki', 'Bajaj', 'TVs', 'Hero', 'Kawasaki', 'KTM', 'Royal Enfield'].map(b => ({ label: b, value: b }));
            case 'Three Wheeler':
                return ['Bajaj', 'Piaggio', 'TVS', 'Mahindra', 'Atul'].map(b => ({ label: b, value: b }));
            case 'Bicycle':
                return ['Lumala', 'Tomahawk', 'Kenstar', 'Hero', 'Giant', 'Trek'].map(b => ({ label: b, value: b }));
            case 'Van':
                return ['Toyota', 'Nissan', 'Mitsubishi', 'Mazda', 'Ford'].map(b => ({ label: b, value: b }));
            case 'Bus':
                return ['Ashok Leyland', 'Tata', 'Mitsubishi', 'Toyota', 'Isuzu'].map(b => ({ label: b, value: b }));
            case 'Lorry':
                return ['Isuzu', 'Tata', 'Mitsubishi', 'Ashok Leyland', 'Hino'].map(b => ({ label: b, value: b }));
            case 'Car':
            default:
                return ['Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mahindra', 'Mercedes', 'Nissan', 'Toyota', 'Suzuki'].map(b => ({ label: b, value: b }));
        }
    };

    const getModels = (type: string, brand: string) => {
        // In a real app, this would filter by brand. For now, we return generic models or specific ones if simple.
        switch (type) {
            case 'Motorbike':
                return ['Dio', 'Hornet', 'FZ', 'Gixxer', 'Pulsar', 'Apache', 'CT100'].map(m => ({ label: m, value: m }));
            case 'Three Wheeler':
                return ['RE 205', '4 Stroke', '2 Stroke', 'Ape'].map(m => ({ label: m, value: m }));
            case 'Bicycle':
                return ['Mountain', 'Road', 'Hybrid', 'BMX'].map(m => ({ label: m, value: m }));
            default:
                return ['XUV', 'XUV500', 'Yaris', 'Corolla', 'Civic', 'Mustang', 'Alto', 'WagonR'].map(m => ({ label: m, value: m }));
        }
    };

    // Common lists
    const conditions = ['Brand New', 'Used', 'Reconditioned', 'Import'].map(c => ({ label: c, value: c }));
    const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(f => ({ label: f, value: f }));
    const transmissions = ['Automatic', 'Manual', 'Tiptronic'].map(t => ({ label: t, value: t }));
    const bodyTypes = ['Saloon', 'Hatchback', 'SUV', 'Convertible', 'Coupe', 'Van', 'Wagon'].map(b => ({ label: b, value: b }));

    const brands = getBrands(vehicleType);
    const models = getModels(vehicleType, carDetails.brand);

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{vehicleType} Details</Text>

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
                        value={carDetails.engineCapacity || ''}
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
