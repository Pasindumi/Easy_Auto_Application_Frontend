import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '@/constants/Colors';

interface Props {
    label: string;
    value: string;
    onSelect: (value: string) => void;
    disabled?: boolean;
    loading?: boolean;
}

const YearSelector: React.FC<Props> = ({ label, value, onSelect, disabled, loading }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const yearList = [];
        for (let y = currentYear + 1; y >= 1950; y--) {
            yearList.push(y.toString());
        }
        return yearList;
    }, []);

    const filteredYears = useMemo(() => {
        if (!searchQuery) return years;
        return years.filter(y => y.includes(searchQuery));
    }, [years, searchQuery]);

    const handleSelect = (year: string) => {
        onSelect(year);
        setModalVisible(false);
        setSearchQuery('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.trigger, disabled && styles.disabledTrigger]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
            >
                <View style={styles.triggerContent}>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.text.muted} style={styles.triggerIcon} />
                    {value ? (
                        <Text style={styles.triggerText}>{value}</Text>
                    ) : (
                        <Text style={styles.placeholderText}>Select...</Text>
                    )}
                </View>
                {loading ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                    <Ionicons name="chevron-down" size={20} color={disabled ? COLORS.text.placeholder : COLORS.text.muted} />
                )}
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.dismissArea} onPress={() => setModalVisible(false)} />
                    <View style={[
                        styles.modalContent,
                        { paddingBottom: Math.max(insets.bottom, 20) }
                    ]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.headerIndicator} />
                            <Text style={styles.modalTitle}>Select Year</Text>
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color={COLORS.text.muted} style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search year (e.g. 2024)..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    keyboardType="numeric"
                                    placeholderTextColor={COLORS.text.placeholder}
                                />
                                {searchQuery !== '' && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <Ionicons name="close-circle" size={20} color={COLORS.text.muted} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <ScrollView
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {filteredYears.length > 0 ? (
                                filteredYears.map((year) => {
                                    const isSelected = value === year;
                                    return (
                                        <TouchableOpacity
                                            key={year}
                                            style={[
                                                styles.listItem,
                                                isSelected && styles.selectedListItem
                                            ]}
                                            onPress={() => handleSelect(year)}
                                        >
                                            <View style={styles.itemContent}>
                                                <View style={[styles.iconDot, isSelected && styles.selectedIconDot]}>
                                                    <Ionicons
                                                        name={isSelected ? "checkmark" : "calendar-outline"}
                                                        size={16}
                                                        color={isSelected ? COLORS.white : COLORS.primary}
                                                    />
                                                </View>
                                                <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                                                    {year}
                                                </Text>
                                            </View>
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <View style={styles.noResults}>
                                    <Ionicons name="search-outline" size={48} color={COLORS.border} />
                                    <Text style={styles.noResultsText}>No years found</Text>
                                </View>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        backgroundColor: '#F9FAFB',
    },
    disabledTrigger: { opacity: 0.5, backgroundColor: COLORS.backgroundMuted },
    triggerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    triggerIcon: { marginRight: 10 },
    triggerText: { fontSize: 15, fontWeight: '600', color: COLORS.text.primary },
    placeholderText: { fontSize: 15, color: COLORS.text.placeholder, fontWeight: '400' },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end'
    },
    dismissArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        width: '100%',
        maxHeight: '80%',
    },
    modalHeader: { marginBottom: 20 },
    headerIndicator: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary, marginBottom: 16, textAlign: 'center' },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 16, color: COLORS.text.primary },

    listContent: { paddingBottom: 20 },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 4,
    },
    selectedListItem: {
        backgroundColor: COLORS.primaryLight,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    selectedIconDot: {
        backgroundColor: COLORS.primary,
    },
    itemText: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.text.secondary,
    },
    selectedItemText: {
        color: COLORS.primary,
        fontWeight: '800',
    },

    noResults: {
        width: '100%',
        paddingVertical: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noResultsText: { marginTop: 12, fontSize: 16, color: COLORS.text.muted, fontWeight: '500' },

    closeButton: {
        marginTop: 10,
        alignItems: 'center',
        paddingVertical: 12,
    },
    closeButtonText: { fontSize: 16, fontWeight: '600', color: COLORS.text.muted },
});

export default YearSelector;
