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
    conditions?: any[]; // Dynamic Conditions
    attributes?: any[]; // Dynamic Attributes
    handleDynamicAttributeChange?: (attrId: string, value: any) => void;
}

const CarDetailsSection: React.FC<Props> = ({
    carDetails,
    handleInputChange,
    vehicleType = 'Car',
    brands = [],
    models = [],
    conditions = [],
    attributes = [],
    handleDynamicAttributeChange
}) => {

    // Helper to get dropdown options
    const getBrandOptions = () => {
        if (brands && brands.length > 0) {
            return brands.map(b => ({ label: b.brand_name, value: b.brand_name }));
        }
        return [];
    };

    const getConditionOptions = () => {
        if (conditions && conditions.length > 0) {
            return conditions.map(c => ({ label: c.condition_name, value: c.condition_name }));
        }
        return [];
    };

    const brandOptions = getBrandOptions();
    const conditionOptions = getConditionOptions();

    // Filter models based on selected brand
    const getModelOptions = () => {
        if (!carDetails.brand) return [];
        // Normalize comparison: trim and lower case both sides
        // Also handle potential potential type mismatches or extra spaces
        const selectedBrand = brands.find(b =>
            String(b.brand_name).toLowerCase().trim() === String(carDetails.brand).toLowerCase().trim()
        );

        // If we can't find the brand object, we can't filter models correctly which disables the dropdown
        if (!selectedBrand) {
            // Fallback: if we can't match ID, maybe return all models or handle differently? 
            // But usually it means data mismatch. 
            // Let's try to match by ID if brand name match fails? (Config usually has ID)
            // But carDetails stores brand NAME. 
            return [];
        }

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

            {/* SECTION 1: Core Details */}
            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <SelectField
                        label="Condition"
                        value={carDetails.condition}
                        options={conditionOptions}
                        onSelect={(val) => handleInputChange('condition', val)}
                    />
                </View>
                <View style={styles.formHalf}>
                    <SelectField
                        label="Brand"
                        value={carDetails.brand}
                        options={brandOptions}
                        onSelect={(val) => {
                            handleInputChange('brand', val);
                            handleInputChange('model', ''); // Reset model when brand changes
                        }}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <SelectField
                        label="Model"
                        value={carDetails.model}
                        options={modelOptions}
                        onSelect={(val) => handleInputChange('model', val)}
                        disabled={!carDetails.brand || modelOptions.length === 0}
                    />
                </View>
                <View style={styles.formHalf}>
                    <Text style={styles.label}>Year</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 2024"
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
                        placeholder="e.g. 45,000"
                        value={carDetails.mileage}
                        onChangeText={(value) => handleInputChange('mileage', value)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.formHalf}>
                    <SelectField
                        label="Fuel Type"
                        value={carDetails.fuelType}
                        options={[
                            { label: 'Petrol', value: 'Petrol' },
                            { label: 'Diesel', value: 'Diesel' },
                            { label: 'Hybrid', value: 'Hybrid' },
                            { label: 'Electric', value: 'Electric' },
                            { label: 'Plug-in Hybrid', value: 'Plug-in Hybrid' },
                            { label: 'Gas', value: 'Gas' },
                        ]}
                        onSelect={(val) => handleInputChange('fuelType', val)}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <SelectField
                        label="Transmission"
                        value={carDetails.transmission}
                        options={[
                            { label: 'Automatic', value: 'Automatic' },
                            { label: 'Manual', value: 'Manual' },
                            { label: 'Tiptronic', value: 'Tiptronic' },
                        ]}
                        onSelect={(val) => handleInputChange('transmission', val)}
                    />
                </View>
                <View style={styles.formHalf}>
                    <Text style={styles.label}>Engine Cap. (cc)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 1500"
                        value={carDetails.engineCapacity}
                        onChangeText={(value) => handleInputChange('engineCapacity', value)}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                    <SelectField
                        label="Body Type"
                        value={carDetails.bodyType || ''}
                        options={[
                            { label: 'Sedan', value: 'Sedan' },
                            { label: 'SUV', value: 'SUV' },
                            { label: 'Hatchback', value: 'Hatchback' },
                            { label: 'Station Wagon', value: 'Station Wagon' },
                            { label: 'Van', value: 'Van' },
                            { label: 'Pickup Truck', value: 'Pickup Truck' },
                            { label: 'Bus', value: 'Bus' },
                            { label: 'Lorry', value: 'Lorry' },
                            { label: 'Convertible', value: 'Convertible' },
                            { label: 'Coupe', value: 'Coupe' },
                        ]}
                        onSelect={(val) => handleInputChange('bodyType', val)}
                    />
                </View>
            </View>

            {attributes && attributes.length > 0 && (
                <View style={styles.dynamicSection}>
                    <View style={styles.divider} />
                    <Text style={styles.subTitle}>Other Specifications</Text>

                    {attributes
                        .filter(attr => !['mileage', 'milage'].includes(attr.attribute_name?.toLowerCase().trim()))
                        .map((attr) => {
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
                                            placeholder=""
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

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 4,
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
    subTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text.primary, marginBottom: 12, marginTop: 8 },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
    formRow: { flexDirection: 'row', gap: 16, marginBottom: 4 },
    formHalf: { flex: 1 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        backgroundColor: '#F9FAFB',
        marginBottom: 20,
        color: COLORS.text.primary
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    dynamicSection: { marginTop: 8 }
});

export default CarDetailsSection;
