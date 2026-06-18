import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

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
    const { colors, isDarkMode } = useTheme();
    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

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
        <View style={themeStyles.container}>
            <Text style={themeStyles.label}>{label}</Text>
            <TouchableOpacity
                style={[themeStyles.input, disabled && themeStyles.disabledInput]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
            >
                <Text style={[themeStyles.inputText, !value && themeStyles.placeholderText, disabled && themeStyles.disabledText]}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Ionicons name="chevron-down" size={20} color={disabled ? (isDarkMode ? colors.backgroundMuted : "#E5E7EB") : colors.text.muted} />
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={themeStyles.modalOverlay}>
                    <View style={themeStyles.modalContent}>
                        <View style={themeStyles.modalHeader}>
                            <Text style={themeStyles.modalTitle}>Select {label}</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(false); setSearchQuery(''); }}>
                                <Ionicons name="close" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        {searchable && (
                            <View style={themeStyles.searchContainer}>
                                <Ionicons name="search" size={20} color={colors.text.muted} />
                                <TextInput
                                    style={themeStyles.searchInput}
                                    placeholder={`Search ${label}...`}
                                    placeholderTextColor={colors.text.muted}
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
                                <TouchableOpacity style={themeStyles.optionItem} onPress={() => handleSelect(item.value)}>
                                    <View style={themeStyles.optionContent}>
                                        <Text style={[themeStyles.optionText, value === item.value && themeStyles.selectedOptionText]}>
                                            {item.label}
                                        </Text>
                                        {value === item.value && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={themeStyles.emptyContainer}>
                                    <Text style={themeStyles.emptyText}>No results found</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '700', color: colors.text.secondary, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        backgroundColor: colors.backgroundSecondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputText: { fontSize: 14, color: colors.text.primary, fontWeight: '500' },
    placeholderText: { color: colors.text.muted, fontWeight: '400' },
    disabledInput: { backgroundColor: colors.backgroundMuted, borderColor: colors.border },
    disabledText: { color: colors.text.muted },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: colors.background,
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
    modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        marginLeft: 8,
        fontSize: 15,
        color: colors.text.primary,
    },
    optionItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    optionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: { fontSize: 16, color: colors.text.primary, fontWeight: '500' },
    selectedOptionText: { color: colors.primary, fontWeight: '700' },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: colors.text.muted, fontSize: 15 },
});

export default SelectField;

