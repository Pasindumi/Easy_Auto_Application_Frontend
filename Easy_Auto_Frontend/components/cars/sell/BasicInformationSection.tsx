import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CarFormState } from '../../../types/sell-car.types';
import LocationModal from '../../ui/LocationModal';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    carDetails: CarFormState;
    handleInputChange: (field: string, value: string | boolean) => void;
    descriptionLimit?: number;
    extraLetterPrice?: number;
    isUnlimited?: boolean;
}

const BasicInformationSection: React.FC<Props> = ({ carDetails, handleInputChange, descriptionLimit = 500, extraLetterPrice = 0, isUnlimited = false }) => {
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const isOverLimit = !isUnlimited && (carDetails.description?.length || 0) > descriptionLimit;

    return (
        <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <View style={styles.limitPill}>
                    <Text style={styles.limitPillText}>{isUnlimited || descriptionLimit >= 10000 ? 'Unlimited' : `${descriptionLimit} chars max`}</Text>
                </View>
            </View>

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Yaris Cross"
                value={carDetails.title}
                onChangeText={(value) => handleInputChange('title', value)}
            />

            <Text style={styles.label}>Price (Rs.)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <TextInput
                    style={[styles.input, { width: 150, marginBottom: 0, marginRight: 12 }]}
                    placeholder="125,500,000"
                    value={carDetails.price}
                    onChangeText={(value) => handleInputChange('price', value)}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleInputChange('negotiable', !carDetails.negotiable)}
                >
                    <View style={[styles.checkbox, carDetails.negotiable && styles.checkboxChecked]}>
                        {carDetails.negotiable && (
                            <View style={styles.checkboxInner} />
                        )}
                    </View>
                    <Text style={styles.negotiableText}>Negotiable</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Location</Text>
            <TouchableOpacity
                style={styles.locationSelector}
                onPress={() => setIsLocationModalVisible(true)}
            >
                <View style={styles.locationInfo}>
                    <Ionicons name="location-outline" size={20} color={carDetails.location ? "#111827" : "#9CA3AF"} />
                    <Text style={[styles.locationText, !carDetails.location && styles.locationPlaceholder]}>
                        {carDetails.location || "Select location (City, District)"}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onSelect={(loc) => handleInputChange('location', loc)}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.descriptionTextArea]}
                placeholder="The all-new Toyota Yaris Cross combines compact design with SUV styling, offering excellent space for all your safety features. Designed for city driving and highway adventures, it delivers an unbeatable smart connectivity and excellent fuel economy."
                value={carDetails.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={descriptionLimit}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={[styles.limitText, isOverLimit && styles.limitTextError]}>
                    {carDetails.description?.length || 0} / {descriptionLimit} characters
                </Text>
                {isOverLimit && (
                    <Text style={styles.warningText}>
                        {extraLetterPrice && extraLetterPrice > 0 ? (
                            `Over limit! +${new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(((carDetails.description?.length || 0) - descriptionLimit) * extraLetterPrice)} will be charged.`
                        ) : (
                            `Only ${descriptionLimit} letters allowed. Extra charges may apply!`
                        )}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    limitPill: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    limitPillText: { fontSize: 10, color: '#6B7280', fontWeight: '600' },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: 'white', marginBottom: 16 },
    descriptionTextArea: { height: 120, paddingTop: 12 },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: 'white',
        marginBottom: 16
    },
    locationInfo: { flexDirection: 'row', alignItems: 'center' },
    locationText: { fontSize: 16, color: '#111827', marginLeft: 8 },
    locationPlaceholder: { color: '#9CA3AF' },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
    checkbox: { width: 16, height: 16, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, marginRight: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
    checkboxChecked: { backgroundColor: '#235CF8', borderColor: '#235CF8' },
    checkboxInner: { width: 6, height: 6, backgroundColor: 'white', borderRadius: 3 },
    negotiableText: { fontSize: 14, color: '#374151' },
    limitText: { fontSize: 12, color: '#6B7280', textAlign: 'right' },
    limitTextError: { color: '#EF4444', fontWeight: 'bold' },
    warningText: { fontSize: 12, color: '#EF4444', fontStyle: 'italic' }
});

export default BasicInformationSection;
