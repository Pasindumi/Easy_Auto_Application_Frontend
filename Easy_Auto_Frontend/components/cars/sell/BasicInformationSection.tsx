import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CarFormState } from '../../../types/sell-car.types';
import COLORS from '@/constants/Colors';
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
    sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text.primary },
    limitPill: { backgroundColor: COLORS.secondary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    limitPillText: { fontSize: 11, color: COLORS.text.secondary, fontWeight: '600' },
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
    descriptionTextArea: { height: 140, paddingTop: 16, textAlignVertical: 'top' },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#F9FAFB',
        marginBottom: 20
    },
    locationInfo: { flexDirection: 'row', alignItems: 'center' },
    locationText: { fontSize: 15, color: COLORS.text.primary, marginLeft: 10, fontWeight: '500' },
    locationPlaceholder: { color: COLORS.text.placeholder },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 6,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white
    },
    checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    checkboxInner: { width: 8, height: 8, backgroundColor: COLORS.white, borderRadius: 2 },
    negotiableText: { fontSize: 15, color: COLORS.text.primary, fontWeight: '500' },
    limitText: { fontSize: 12, color: COLORS.text.muted, textAlign: 'right' },
    limitTextError: { color: COLORS.status.danger, fontWeight: '700' },
    warningText: { fontSize: 12, color: COLORS.status.danger, fontStyle: 'italic', marginTop: 4 }
});

export default BasicInformationSection;
