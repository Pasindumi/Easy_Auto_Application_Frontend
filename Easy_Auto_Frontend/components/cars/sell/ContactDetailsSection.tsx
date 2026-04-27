import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    userName?: string;
    email: string;
    contactNumber: string;
    hidePhoneNumber: boolean;
    handleInputChange: (field: string, value: string | boolean) => void;
    setHidePhoneNumber: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactDetailsSection: React.FC<Props> = ({
    userName,
    email,
    contactNumber,
    hidePhoneNumber,
    handleInputChange,
    setHidePhoneNumber
}) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Details</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder=""
                value={userName ? userName.replace(/user/ig, '').trim() : ''}
                onChangeText={(value) => handleInputChange('contactName', value)}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder=""
                value={email}
                onChangeText={(value) => handleInputChange('email', value)}
            />

            <View style={styles.contactBox}>
                <Text style={styles.contactBoxTitle}>Phone Number</Text>
                <View style={styles.contactRow}>
                    <TextInput
                        style={styles.contactPhoneInput}
                        placeholder=""
                        value={contactNumber}
                        onChangeText={(value) => handleInputChange('contactNumber', value)}
                        keyboardType="phone-pad"
                    />
                    {/* Removed Add Button because it should be auto-filled or just simple input */}
                </View>
                <View style={styles.contactInfoBox}>
                    <Text style={styles.contactInfoText}>Buyers can WhatsApp your first number. Make sure it&apos;s active</Text>
                </View>
                <View style={styles.contactCheckboxRow}>
                    <TouchableOpacity
                        style={styles.contactCheckboxOuter}
                        onPress={() => setHidePhoneNumber(prev => !prev)}
                    >
                        {hidePhoneNumber && (
                            <View style={styles.contactCheckboxInner}>
                                <Ionicons name="checkmark" size={14} color="#235CF8" />
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.contactCheckboxLabel}>Hide phone number</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: { backgroundColor: 'white', borderRadius: 4, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
    sectionSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: 'white', marginBottom: 16, color: '#6B7280' },
    contactBox: { backgroundColor: '#F3F8FF', borderRadius: 12, padding: 16 },
    contactBoxTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
    contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    contactPhoneInput: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: 'white' },
    contactAddButton: { backgroundColor: '#235CF8', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 10, marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
    contactAddButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    contactInfoBox: { backgroundColor: '#FFF9C4', borderRadius: 8, padding: 8, marginVertical: 8 },
    contactInfoText: { color: '#7A6A00', fontSize: 13 },
    contactCheckboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    contactCheckboxOuter: { width: 18, height: 18, borderWidth: 1.5, borderColor: '#235CF8', borderRadius: 4, marginRight: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
    contactCheckboxInner: { position: 'absolute', left: 2, top: 2, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
    contactCheckboxLabel: { fontSize: 13, color: '#374151' },
});

export default ContactDetailsSection;
