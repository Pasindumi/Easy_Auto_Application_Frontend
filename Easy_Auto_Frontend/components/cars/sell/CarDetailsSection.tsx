import SelectField from '@/components/ui/SelectField';
import React from 'react';
import { StyleSheet, Text, TextInput, View, Switch } from 'react-native';
import { CarFormState } from '../../../types/sell-car.types';

interface Props {
    carDetails: CarFormState;
    handleInputChange: (field: string, value: any) => void;
    vehicleType?: string;
    brands?: any[]; // Dynamic Brands
    models?: any[]; // Dynamic Models
    attributes?: any[]; // Dynamic Attributes
    handleDynamicAttributeChange?: (attrId: string, value: any) => void;
}

const CarDetailsSection: React.FC<Props> = ({
    carDetails,
    handleInputChange,
    vehicleType = 'Car',
    brands = [],
    models = [],
    attributes = [],
    handleDynamicAttributeChange
}) => {

    // Helper to get dropdown options
    const getBrandOptions = () => {
        if (brands && brands.length > 0) {
            return brands.map(b => ({ label: b.brand_name, value: b.brand_name }));
        }
        // Fallback hardcoded (Legacy support)
        return ['Other'].map(b => ({ label: b, value: b }));
    };

    // Common lists (Static)
    const conditions = ['Brand New', 'Used', 'Reconditioned', 'Import'].map(c => ({ label: c, value: c }));
    const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'].map(f => ({ label: f, value: f }));
    const transmissions = ['Automatic', 'Manual', 'Tiptronic'].map(t => ({ label: t, value: t }));
    const bodyTypes = ['Saloon', 'Hatchback', 'SUV', 'Convertible', 'Coupe', 'Van', 'Wagon'].map(b => ({ label: b, value: b }));

    const brandOptions = getBrandOptions();

    // Filter models based on selected brand
    const getModelOptions = () => {
        if (!carDetails.brand) return [];
        const selectedBrand = brands.find(b => b.brand_name === carDetails.brand);
        if (!selectedBrand) return [];

        const filteredModels = models.filter(m => m.brand_id === selectedBrand.id);
        if (filteredModels.length > 0) {
            return filteredModels.map(m => ({ label: m.model_name, value: m.model_name }));
        }
        return [];
    };

    const modelOptions = getModelOptions();

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{vehicleType} Details</Text>

            {/* CORE FIELDS (Always present as per schema, but maybe populated safely) */}
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
                    {/* Brand Select */}
                    <SelectField
                        label="Brand"
                        value={carDetails.brand}
                        options={brandOptions}
                        onSelect={(val) => handleInputChange('brand', val)}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    {/* Model - Select or Input fallback */}
                    {modelOptions.length > 0 ? (
                        <SelectField
                            label="Model"
                            value={carDetails.model}
                            options={modelOptions}
                            onSelect={(val) => handleInputChange('model', val)}
                        />
                    ) : (
                        <>
                            <Text style={styles.label}>Model</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Corolla"
                                value={carDetails.model}
                                onChangeText={(value) => handleInputChange('model', value)}
                            />
                        </>
                    )}
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

            {/* Standard optional fields */}
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
                    <Text style={styles.label}>Engine</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="1500"
                        value={carDetails.engineCapacity}
                        onChangeText={(value) => handleInputChange('engineCapacity', value)}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            <SelectField label="Transmission" value={carDetails.transmission} options={transmissions} onSelect={(val) => handleInputChange('transmission', val)} />
            <SelectField label="Fuel Type" value={carDetails.fuelType} options={fuelTypes} onSelect={(val) => handleInputChange('fuelType', val)} />
            <SelectField label="Body Type" value={carDetails.bodyType || ''} options={bodyTypes} onSelect={(val) => handleInputChange('bodyType', val)} />


            {/* DYNAMIC ATTRIBUTES SECTION */}
            {attributes && attributes.length > 0 && (
                <View style={styles.dynamicSection}>
                    <View style={styles.divider} />
                    <Text style={styles.subTitle}>Additional Specifications</Text>

                    {attributes.map((attr) => {
                        const currentValue = carDetails.dynamicAttributes?.find(a => a.attribute_id === attr.id)?.value || '';

                        if (attr.data_type === 'DROPDOWN') {
                            const opts = attr.options?.map((o: any) => ({ label: o.option_value, value: o.option_value })) || [];
                            return (
                                <SelectField
                                    key={attr.id}
                                    label={`${attr.attribute_name} ${attr.is_required ? '*' : ''}`}
                                    value={currentValue}
                                    options={opts}
                                    onSelect={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                />
                            );
                        } else if (attr.data_type === 'BOOLEAN') {
                            return (
                                <View key={attr.id} style={styles.switchRow}>
                                    <Text style={styles.label}>{attr.attribute_name} {attr.is_required ? '*' : ''}</Text>
                                    <Switch
                                        value={currentValue === 'true' || currentValue === true}
                                        onValueChange={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                    />
                                </View>
                            );
                        } else {
                            // TEXT or NUMBER
                            return (
                                <View key={attr.id}>
                                    <Text style={styles.label}>
                                        {attr.attribute_name} {attr.unit ? `(${attr.unit})` : ''} {attr.is_required ? '*' : ''}
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        value={String(currentValue)}
                                        onChangeText={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                        keyboardType={attr.data_type === 'NUMBER' ? 'numeric' : 'default'}
                                        placeholder={`Enter ${attr.attribute_name}`}
                                    />
                                </View>
                            );
                        }
                    })}
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    section: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
    subTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 10, marginTop: 5 },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 15 },
    formRow: { flexDirection: 'row', gap: 12 },
    formHalf: { flex: 1 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: 'white', marginBottom: 16 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    dynamicSection: { marginTop: 10 }
});

export default CarDetailsSection;
