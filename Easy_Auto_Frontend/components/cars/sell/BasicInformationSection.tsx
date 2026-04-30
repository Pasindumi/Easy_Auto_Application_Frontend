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
    hidePrice?: boolean;
}

const BasicInformationSection: React.FC<Props> = ({ carDetails, handleInputChange, descriptionLimit = 500, extraLetterPrice = 0, isUnlimited = false, hidePrice = false }) => {
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const isOverLimit = !isUnlimited && (carDetails.description?.length || 0) > descriptionLimit;

    return (
        <View style={styles.section}>
            <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Ionicons name="text-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                    <Text style={styles.label}>Title</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Toyota Aqua S Grade 2018"
                    placeholderTextColor={COLORS.text.placeholder}
                    value={carDetails.title}
                    onChangeText={(value) => handleInputChange('title', value)}
                />
            </View>

            {!hidePrice && (
                <View style={styles.priceRow}>
                    <View style={styles.priceFieldContainer}>
                        <View style={styles.labelRow}>
                            <Ionicons name="pricetag-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                            <Text style={styles.label}>Price</Text>
                        </View>
                        <View style={styles.priceInputWrapper}>
                            <View style={styles.currencyPrefix}>
                                <Text style={styles.currencyText}>Rs.</Text>
                            </View>
                            <TextInput
                                style={styles.priceInput}
                                placeholder=""
                                placeholderTextColor={COLORS.text.placeholder}
                                value={carDetails.price}
                                onChangeText={(value) => handleInputChange('price', value)}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.negotiableChip,
                            carDetails.negotiable && styles.negotiableChipActive
                        ]}
                        activeOpacity={0.7}
                        onPress={() => handleInputChange('negotiable', !carDetails.negotiable)}
                    >

                        <Text style={[
                            styles.negotiableText,
                            carDetails.negotiable && styles.negotiableTextActive
                        ]}>
                            Negotiable
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Ionicons name="location-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                    <Text style={styles.label}>Location</Text>
                </View>
                <TouchableOpacity
                    style={styles.locationSelector}
                    activeOpacity={0.6}
                    onPress={() => setIsLocationModalVisible(true)}
                >
                    <Text style={[styles.locationText, !carDetails.location && styles.locationPlaceholder]}>
                        {carDetails.location || "Select your city"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onSelect={(loc) => handleInputChange('location', loc)}
            />

            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
                <View style={styles.labelRow}>
                    <Ionicons name="document-text-outline" size={16} color={COLORS.primary} style={styles.labelIcon} />
                    <Text style={styles.label}>Description</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.descriptionTextArea]}
                    placeholder="Tell us about your vehicle..."
                    placeholderTextColor={COLORS.text.placeholder}
                    value={carDetails.description}
                    onChangeText={(value) => handleInputChange('description', value)}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    maxLength={descriptionLimit}
                />
            </View>

            <View style={styles.footerRow}>
                <Text style={[styles.limitText, isOverLimit && styles.limitTextError]}>
                    {carDetails.description?.length || 0} / {descriptionLimit} characters
                </Text>
                {isOverLimit && (
                    <Text style={styles.warningText}>
                        {extraLetterPrice && extraLetterPrice > 0 ? (
                            `Over limit! +${new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(((carDetails.description?.length || 0) - descriptionLimit) * extraLetterPrice)} will be charged.`
                        ) : (
                            `Only ${descriptionLimit} letters allowed.`
                        )}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircleTitle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    limitPill: {
        backgroundColor: COLORS.primary + '10',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    limitPillText: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    inputGroup: {
        marginBottom: 12,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
        marginLeft: 4,
    },
    labelIcon: {
        marginRight: 8,
        opacity: 0.8,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.text.secondary,
    },
    input: {
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 5,
        paddingHorizontal: 12,
        height: 40,
        fontSize: 14,
        backgroundColor: '#F8FAFC',
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 12,
        width: '100%',
    },
    priceFieldContainer: {
        width: '65%',
    },
    priceInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 5,
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
        height: 40,
    },
    currencyPrefix: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
    },
    currencyText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    priceInput: {
        flex: 1,
        paddingHorizontal: 14,
        height: '100%',
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '700',
    },
    negotiableChip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        height: 40,
        borderRadius: 5,
        backgroundColor: COLORS.primary + '10',
        borderWidth: 1,
        borderColor: 'transparent',
        width: '32%',
    },
    negotiableChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    negotiableText: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '700',
    },
    negotiableTextActive: {
        color: COLORS.white,
    },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#F8FAFC',
        height: 40,
    },
    locationText: {
        fontSize: 15,
        color: COLORS.text.primary,
        fontWeight: '600',
    },
    locationPlaceholder: {
        color: COLORS.text.placeholder,
        fontWeight: '500',
    },
    descriptionTextArea: {
        height: 160,
        paddingTop: 18,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 4,
    },
    limitText: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: '600',
    },
    limitTextError: {
        color: COLORS.status.danger,
        fontWeight: '800',
    },
    warningText: {
        fontSize: 12,
        color: COLORS.status.danger,
        fontWeight: '600',
    },
});

export default BasicInformationSection;
