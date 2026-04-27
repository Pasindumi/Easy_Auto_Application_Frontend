import { Ionicons } from '@expo/vector-icons';
import ConditionSelector from './ConditionSelector';
import BrandSelector from './BrandSelector';
import ModelSelector from './ModelSelector';
import YearSelector from './YearSelector';
import OptionSelector, { SelectionOption } from './OptionSelector';
import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { CarFormState } from '../../../types/sell-car.types';
import CustomTextInput from '../../ui/CustomTextInput';

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
    const getFilteredModels = () => {
        if (!carDetails.brand) return [];
        const selectedBrand = brands.find(b =>
            String(b.brand_name).toLowerCase().trim() === String(carDetails.brand).toLowerCase().trim()
        );

        if (!selectedBrand) return [];
        return models.filter(m => m.brand_id === selectedBrand.id);
    };

    const filteredModels = getFilteredModels();

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{vehicleType} Details</Text>

            {/* SECTION 1: Core Details */}
            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <ConditionSelector
                        label="Condition"
                        value={carDetails.condition}
                        options={conditionOptions}
                        onSelect={(val) => handleInputChange('condition', val)}
                    />
                </View>
                <View style={styles.formHalf}>
                    <BrandSelector
                        label="Brand"
                        value={carDetails.brand}
                        brands={brands}
                        onSelect={(val) => {
                            handleInputChange('brand', val);
                            handleInputChange('model', ''); // Reset model when brand changes
                        }}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <ModelSelector
                        label="Model"
                        value={carDetails.model}
                        models={filteredModels}
                        onSelect={(val) => handleInputChange('model', val)}
                        disabled={!carDetails.brand || filteredModels.length === 0}
                    />
                </View>
                <View style={styles.formHalf}>
                    <YearSelector
                        label="Year"
                        value={carDetails.year}
                        onSelect={(val) => handleInputChange('year', val)}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <CustomTextInput
                        label="Mileage (km)"
                        iconName="speedometer-outline"
                        placeholder="e.g. 45,000"
                        value={carDetails.mileage}
                        onChangeText={(value) => handleInputChange('mileage', value)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.formHalf}>
                    <OptionSelector
                        label="Fuel Type"
                        value={carDetails.fuelType}
                        triggerIcon="color-fill-outline"
                        options={[
                            { label: 'Petrol', value: 'Petrol', icon: 'water-outline' },
                            { label: 'Diesel', value: 'Diesel', icon: 'flask-outline' },
                            { label: 'Hybrid', value: 'Hybrid', icon: 'leaf-outline' },
                            { label: 'Electric', value: 'Electric', icon: 'flash-outline' },
                            { label: 'Plug-in', value: 'Plug-in Hybrid', icon: 'battery-charging-outline' },
                            { label: 'Gas', value: 'Gas', icon: 'flame-outline' },
                        ]}
                        onSelect={(val) => handleInputChange('fuelType', val)}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <OptionSelector
                        label="Transmission"
                        value={carDetails.transmission}
                        triggerIcon="git-network-outline"
                        options={[
                            { label: 'Automatic', value: 'Automatic', icon: 'car-outline' },
                            { label: 'Manual', value: 'Manual', icon: 'git-compare-outline' },
                            { label: 'Tiptronic', value: 'Tiptronic', icon: 'car-sport-outline' },
                        ]}
                        onSelect={(val) => handleInputChange('transmission', val)}
                    />
                </View>
                <View style={styles.formHalf}>
                    <CustomTextInput
                        label="Engine Cap. (cc)"
                        iconName="options-outline"
                        placeholder="e.g. 1500"
                        value={carDetails.engineCapacity}
                        onChangeText={(value) => handleInputChange('engineCapacity', value)}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                    <OptionSelector
                        label="Body Type"
                        value={carDetails.bodyType || ''}
                        triggerIcon="car-sport-outline"
                        layout="grid"
                        options={[
                            { label: 'Sedan', value: 'Sedan', icon: 'car-outline' },
                            { label: 'SUV', value: 'SUV', icon: 'car-sport-outline' },
                            { label: 'Hatchback', value: 'Hatchback', icon: 'car-outline' },
                            { label: 'Station Wagon', value: 'Station Wagon', icon: 'car-sport-outline' },
                            { label: 'Van', value: 'Van', icon: 'bus-outline' },
                            { label: 'Pickup', value: 'Pickup Truck', icon: 'car-sport-outline' },
                            { label: 'Bus', value: 'Bus', icon: 'bus-outline' },
                            { label: 'Lorry', value: 'Lorry', icon: 'construct-outline' },
                            { label: 'Convertible', value: 'Convertible', icon: 'umbrella-outline' },
                            { label: 'Coupe', value: 'Coupe', icon: 'car-sport-outline' },
                        ]}
                        onSelect={(val) => handleInputChange('bodyType', val)}
                    />
                </View>
            </View>

            {attributes && attributes.length > 0 && (
                <View style={styles.dynamicSection}>
                    <View style={styles.divider} />
                    <View style={styles.titleWithIcon}>
                        <Ionicons name="list-circle-outline" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>Other Specifications</Text>
                    </View>

                    <View style={styles.attributesContainer}>
                        {attributes
                            .filter(attr => !['mileage', 'milage'].includes(attr.attribute_name?.toLowerCase().trim()))
                            .map((attr) => {
                                const currentValue = carDetails.dynamicAttributes?.find(a => a.attribute_id === attr.id)?.value || '';

                                if (attr.data_type === 'DROPDOWN') {
                                    const opts = attr.options?.map((o: any) => ({ label: o.option_value, value: o.option_value, icon: 'list-outline' })) || [];
                                    return (
                                        <OptionSelector
                                            key={attr.id}
                                            label={`${attr.attribute_name} ${attr.is_required ? '*' : ''}`}
                                            value={String(currentValue)}
                                            triggerIcon="options-outline"
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
                                        <CustomTextInput
                                            key={attr.id}
                                            label={`${attr.attribute_name} ${attr.unit ? `(${attr.unit})` : ''} ${attr.is_required ? '*' : ''}`}
                                            iconName="create-outline"
                                            value={String(currentValue)}
                                            onChangeText={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                            keyboardType={attr.data_type === 'NUMBER' ? 'numeric' : 'default'}
                                            placeholder=""
                                        />
                                    );
                                }
                            })}
                    </View>
                </View>
            )}
        </View>
    );
};

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
    section: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.text.primary,
        marginBottom: 20,
        letterSpacing: -0.5
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text.primary,
        marginBottom: 16,
        marginTop: 8,
        letterSpacing: -0.3
    },
    titleWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    attributesContainer: {
        marginTop: 10,
    },
    divider: { height: 1.5, backgroundColor: '#F3F4F6', marginVertical: 24 },
    formRow: { flexDirection: 'row', gap: 16, marginBottom: 4 },
    formHalf: { flex: 1 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.border
    },
    dynamicSection: { marginTop: 8 }
});

export default CarDetailsSection;
