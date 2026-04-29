import { Ionicons } from '@expo/vector-icons';
import ConditionSelector from './ConditionSelector';
import BrandSelector from './BrandSelector';
import ModelSelector from './ModelSelector';
import YearSelector from './YearSelector';
import OptionSelector, { SelectionOption } from './OptionSelector';
import React from 'react';
import { StyleSheet, Text, View, Switch, TextInput } from 'react-native';
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
                    <View style={styles.labelRow}>
                        <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Condition</Text>
                    </View>
                    <ConditionSelector
                        label=""
                        value={carDetails.condition}
                        options={conditionOptions}
                        onSelect={(val) => handleInputChange('condition', val)}
                    />
                </View>
                <View style={styles.formHalf}>
                    <View style={styles.labelRow}>
                        <Ionicons name="ribbon-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Brand</Text>
                    </View>
                    <BrandSelector
                        label=""
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
                    <View style={styles.labelRow}>
                        <Ionicons name="layers-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Model</Text>
                    </View>
                    <ModelSelector
                        label=""
                        value={carDetails.model}
                        models={filteredModels}
                        onSelect={(val) => handleInputChange('model', val)}
                        disabled={!carDetails.brand || filteredModels.length === 0}
                    />
                </View>
                <View style={styles.formHalf}>
                    <View style={styles.labelRow}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Year</Text>
                    </View>
                    <YearSelector
                        label=""
                        value={carDetails.year}
                        onSelect={(val) => handleInputChange('year', val)}
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formHalf}>
                    <View style={styles.labelRow}>
                        <Ionicons name="speedometer-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Mileage (km)</Text>
                    </View>
                    <CustomTextInput
                        label=""
                        placeholder="e.g. 45,000"
                        value={carDetails.mileage}
                        onChangeText={(value) => handleInputChange('mileage', value)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.formHalf}>
                    <View style={styles.labelRow}>
                        <Ionicons name="color-fill-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Fuel Type</Text>
                    </View>
                    <OptionSelector
                        label=""
                        value={carDetails.fuelType}
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
                    <View style={styles.labelRow}>
                        <Ionicons name="git-network-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Transmission</Text>
                    </View>
                    <OptionSelector
                        label=""
                        value={carDetails.transmission}
                        options={[
                            { label: 'Automatic', value: 'Automatic', icon: 'car-outline' },
                            { label: 'Manual', value: 'Manual', icon: 'git-compare-outline' },
                            { label: 'Tiptronic', value: 'Tiptronic', icon: 'car-sport-outline' },
                        ]}
                        onSelect={(val) => handleInputChange('transmission', val)}
                    />
                </View>
                <View style={styles.formHalf}>
                    <View style={styles.labelRow}>
                        <Ionicons name="options-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Engine Cap. (cc)</Text>
                    </View>
                    <CustomTextInput
                        label=""
                        placeholder="e.g. 1500"
                        value={carDetails.engineCapacity}
                        onChangeText={(value) => handleInputChange('engineCapacity', value)}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={{ flex: 1 }}>
                    <View style={styles.labelRow}>
                        <Ionicons name="car-sport-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                        <Text style={styles.label}>Body Type</Text>
                    </View>
                    <OptionSelector
                        label=""
                        value={carDetails.bodyType || ''}
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
                <View style={styles.dynamicSectionCard}>
                    <View style={styles.dynamicTitleContainer}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.dynamicSectionTitle}>Other Specifications</Text>
                            <Text style={styles.dynamicSectionSubtitle}>Extra details & options for your vehicle</Text>
                        </View>
                    </View>

                    <View style={styles.attributesContainer}>
                        {(() => {
                            const validAttributes = attributes.filter(attr => !['mileage', 'milage'].includes(attr.attribute_name?.toLowerCase().trim()));
                            const rows = [];

                            const renderAttributeField = (attr: any) => {
                                const currentValue = carDetails.dynamicAttributes?.find(a => a.attribute_id === attr.id)?.value || '';

                                if (attr.data_type === 'DROPDOWN') {
                                    const attrLower = attr.attribute_name?.toLowerCase() || '';

                                    if (attrLower.includes('color') || attrLower.includes('colour')) {
                                        return (
                                            <View style={styles.customFieldContainer}>
                                                <View style={styles.customFieldInputWrapper}>

                                                    <TextInput
                                                        style={styles.customFieldInput}
                                                        value={String(currentValue)}
                                                        onChangeText={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                                        placeholder="Add extra features (e.g. Full option...)"
                                                        placeholderTextColor="#9CA3AF"
                                                    />
                                                </View>
                                            </View>
                                        );
                                    }

                                    const opts = attr.options?.map((o: any) => ({ label: o.option_value, value: o.option_value, icon: 'checkmark-circle-outline' })) || [];
                                    return (
                                        <OptionSelector
                                            label={`${attr.attribute_name} ${attr.is_required ? '*' : ''}`}
                                            value={String(currentValue)}
                                            options={opts}
                                            onSelect={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                        />
                                    );
                                } else if (attr.data_type === 'BOOLEAN') {
                                    return (
                                        <View style={styles.switchRow}>
                                            <Text style={[styles.label, { marginBottom: 0, flex: 1, marginRight: 8 }]} numberOfLines={2}>
                                                {attr.attribute_name} {attr.is_required ? '*' : ''}
                                            </Text>
                                            <Switch
                                                value={currentValue === 'true' || currentValue === true}
                                                onValueChange={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                                trackColor={{ false: '#E5E7EB', true: COLORS.primary }}
                                            />
                                        </View>
                                    );
                                } else {
                                    // TEXT or NUMBER
                                    let iconName: any = "create-outline";
                                    const attrLower = attr.attribute_name?.toLowerCase() || '';

                                    let displayLabel = `${attr.attribute_name} ${attr.unit ? `(${attr.unit})` : ''} ${attr.is_required ? '*' : ''}`;
                                    let displayPlaceholder = `e.g. ${attr.data_type === 'NUMBER' ? '123' : 'Value'}`;

                                    if (attrLower.includes('color') || attrLower.includes('colour')) {
                                        return (
                                            <View style={styles.customFieldContainer}>
                                                <View style={styles.customFieldInputWrapper}>

                                                    <TextInput
                                                        style={styles.customFieldInput}
                                                        value={String(currentValue)}
                                                        onChangeText={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                                        placeholder="Add extra features (e.g. Full option...)"
                                                        placeholderTextColor="#9CA3AF"
                                                    />
                                                </View>
                                            </View>
                                        );
                                    } else if (attrLower.includes('door')) {
                                        iconName = "grid-outline";
                                    } else if (attrLower.includes('seat')) {
                                        iconName = "people-outline";
                                    } else if (attr.data_type === 'NUMBER') {
                                        iconName = "calculator-outline";
                                    }

                                    return (
                                        <CustomTextInput
                                            label={displayLabel}
                                            value={String(currentValue)}
                                            onChangeText={(val) => handleDynamicAttributeChange && handleDynamicAttributeChange(attr.id, val)}
                                            keyboardType={attr.data_type === 'NUMBER' ? 'numeric' : 'default'}
                                            placeholder={displayPlaceholder}
                                        />
                                    );
                                }
                            };

                            const items = [];
                            let i = 0;
                            while (i < validAttributes.length) {
                                const attr1 = validAttributes[i];
                                const attr1Lower = attr1.attribute_name?.toLowerCase() || '';
                                const isFullWidth = attr1Lower.includes('color') || attr1Lower.includes('colour') || attr1Lower.includes('extra') || attr1Lower.includes('feature');

                                if (isFullWidth) {
                                    items.push(
                                        <View key={`attr-full-${i}`} style={[styles.formRow, { marginBottom: 16 }]}>
                                            <View style={{ flex: 1 }}>
                                                {renderAttributeField(attr1)}
                                            </View>
                                        </View>
                                    );
                                    i += 1;
                                } else {
                                    const attr2 = validAttributes[i + 1];
                                    const attr2Lower = attr2?.attribute_name?.toLowerCase() || '';
                                    const isAttr2FullWidth = attr2 && (attr2Lower.includes('color') || attr2Lower.includes('colour') || attr2Lower.includes('extra') || attr2Lower.includes('feature'));

                                    if (isAttr2FullWidth || !attr2) {
                                        items.push(
                                            <View key={`attr-half-${i}`} style={styles.formRow}>
                                                <View style={styles.formHalf}>
                                                    {renderAttributeField(attr1)}
                                                </View>
                                                <View style={styles.formHalf} />
                                            </View>
                                        );
                                        i += 1;
                                    } else {
                                        items.push(
                                            <View key={`attr-row-${i}`} style={styles.formRow}>
                                                <View style={styles.formHalf}>
                                                    {renderAttributeField(attr1)}
                                                </View>
                                                <View style={styles.formHalf}>
                                                    {renderAttributeField(attr2)}
                                                </View>
                                            </View>
                                        );
                                        i += 2;
                                    }
                                }
                            }
                            return items;
                        })()}
                    </View>
                </View>
            )}
        </View>
    );
};

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 16,
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
        marginTop: 4,
    },
    divider: { height: 1.5, backgroundColor: '#F3F4F6', marginVertical: 24 },
    formRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, width: '100%' },
    formHalf: { width: '48.5%' },
    triggerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: -2, marginLeft: 2 },
    labelIcon: { marginRight: 6, opacity: 0.9 },
    label: { fontSize: 13, fontWeight: '500', color: COLORS.text.secondary },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        minHeight: 40,
    },
    dynamicSection: { marginTop: 8 },
    dynamicSectionCard: {
        marginTop: 16,
    },
    dynamicTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1.5,
        borderColor: 'rgba(59, 130, 246, 0.15)',
    },
    dynamicSectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.text.primary,
        letterSpacing: -0.4,
    },
    dynamicSectionSubtitle: {
        fontSize: 13,
        color: COLORS.text.secondary || '#6B7280',
        marginTop: 3,
        fontWeight: '500',
    },
    customFieldContainer: {
        width: '100%',
        marginTop: 4,
        marginBottom: 8,
    },
    customFieldInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
    },
    customFieldIcon: {
        marginRight: 10,
        backgroundColor: '#F1F5F9',
        padding: 6,
        borderRadius: 10,
    },
    customFieldInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text.primary,
        fontWeight: '500',
    }
});

export default CarDetailsSection;
