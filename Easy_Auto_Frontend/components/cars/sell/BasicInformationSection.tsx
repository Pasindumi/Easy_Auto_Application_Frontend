import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CarFormState } from '../../../types/sell-car.types';

interface Props {
    carDetails: CarFormState;
    handleInputChange: (field: string, value: string | boolean) => void;
    descriptionLimit?: number;
}

const BasicInformationSection: React.FC<Props> = ({ carDetails, handleInputChange, descriptionLimit = 500 }) => {
    const isOverLimit = (carDetails.description?.length || 0) > descriptionLimit;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Yaris Cross"
                value={carDetails.title}
                onChangeText={(value) => handleInputChange('title', value)}
            />

            <Text style={styles.label}>Price ($)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <TextInput
                    style={[styles.input, { width: 120, marginBottom: 0, marginRight: 12 }]}
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
            <TextInput
                style={styles.input}
                placeholder="Nugegoda, Sri Lanka"
                value={carDetails.location}
                onChangeText={(value) => handleInputChange('location', value)}
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
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={[styles.limitText, isOverLimit && styles.limitTextError]}>
                    {carDetails.description?.length || 0} / {descriptionLimit} characters
                </Text>
                {isOverLimit && (
                    <Text style={styles.warningText}>
                        Only {descriptionLimit} letters allowed. Extra charges may apply!
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: 'white', marginBottom: 16 },
    descriptionTextArea: { height: 120, paddingTop: 12 },
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
