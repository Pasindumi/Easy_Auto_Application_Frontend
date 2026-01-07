import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Option {
    label: string;
    value: string;
}

interface Props {
    label: string;
    value: string;
    placeholder?: string;
    options: Option[];
    onSelect: (value: string) => void;
    disabled?: boolean;
}

const SelectField: React.FC<Props> = ({ label, value, placeholder = "Select...", options, onSelect, disabled }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (val: string) => {
        onSelect(val);
        setModalVisible(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.input, disabled && styles.disabledInput]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
            >
                <Text style={[styles.inputText, !value && styles.placeholderText, disabled && styles.disabledText]}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Ionicons name="chevron-down" size={20} color={disabled ? "#E5E7EB" : "#9CA3AF"} />
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select {label}</Text>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item.value)}>
                                    <Text style={[styles.optionText, value === item.value && styles.selectedOptionText]}>
                                        {item.label}
                                    </Text>
                                    {value === item.value && <Ionicons name="checkmark" size={20} color="#2563EB" />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputText: { fontSize: 16, color: '#1F2937' },
    placeholderText: { color: '#9CA3AF' },
    disabledInput: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
    disabledText: { color: '#9CA3AF' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, maxHeight: 400 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    optionItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: { fontSize: 16, color: '#374151' },
    selectedOptionText: { color: '#2563EB', fontWeight: '600' },
});

export default SelectField;
