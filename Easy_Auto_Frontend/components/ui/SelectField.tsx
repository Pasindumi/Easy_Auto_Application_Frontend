import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    searchable?: boolean;
}

const SelectField: React.FC<Props> = ({ label, value, placeholder = "Select...", options, onSelect, disabled, searchable = false }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSelect = (val: string) => {
        onSelect(val);
        setModalVisible(false);
        setSearchQuery('');
    };

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

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

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select {label}</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(false); setSearchQuery(''); }}>
                                <Ionicons name="close" size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        {searchable && (
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color="#9CA3AF" />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder={`Search ${label}...`}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus={false}
                                />
                            </View>
                        )}

                        <FlatList
                            data={filteredOptions}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item.value)}>
                                    <View style={styles.optionContent}>
                                        <Text style={[styles.optionText, value === item.value && styles.selectedOptionText]}>
                                            {item.label}
                                        </Text>
                                        {value === item.value && <Ionicons name="checkmark" size={20} color="#235CF8" />}
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No results found</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputText: { fontSize: 15, color: '#111827', fontWeight: '500' },
    placeholderText: { color: '#9CA3AF', fontWeight: '400' },
    disabledInput: { backgroundColor: '#F9FAFB', borderColor: '#F3F4F6' },
    disabledText: { color: '#9CA3AF' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 8,
        fontSize: 15,
        color: '#111827',
    },
    optionItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    optionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: { fontSize: 16, color: '#374151', fontWeight: '500' },
    selectedOptionText: { color: '#235CF8', fontWeight: '700' },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#9CA3AF', fontSize: 15 },
});

export default SelectField;
