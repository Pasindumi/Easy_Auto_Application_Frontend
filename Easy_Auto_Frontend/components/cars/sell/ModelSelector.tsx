import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface Model {
    id: string;
    model_name: string;
}

interface Props {
    label: string;
    value: string;
    models: Model[];
    onSelect: (value: string) => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
}

const ModelSelector: React.FC<Props> = ({ label, value, models, onSelect, disabled, loading, placeholder = "Select..." }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();

    const safeModels = models || [];

    const filteredModels = useMemo(() => {
        if (!searchQuery) return safeModels;
        return safeModels.filter(m =>
            m.model_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [safeModels, searchQuery]);

    const handleSelect = (modelName: string) => {
        onSelect(modelName);
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
                    {value ? (
                        <Text style={styles.triggerText} numberOfLines={1}>{value}</Text>
                    ) : (
                        <Text style={styles.placeholderText}>{placeholder}</Text>
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
                            <Text style={styles.modalTitle}>{label}</Text>
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color={COLORS.text.muted} style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search model..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
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
                            {filteredModels.length > 0 ? (
                                filteredModels.map((model) => {
                                    const isSelected = value === model.model_name;
                                    return (
                                        <TouchableOpacity
                                            key={model.id}
                                            style={[
                                                styles.listItem,
                                                isSelected && styles.selectedListItem
                                            ]}
                                            onPress={() => handleSelect(model.model_name)}
                                        >
                                            <View style={styles.itemContent}>
                                                <View style={[styles.iconDot, isSelected && styles.selectedIconDot]}>
                                                    <Ionicons
                                                        name={isSelected ? "checkmark" : "car-outline"}
                                                        size={16}
                                                        color={isSelected ? COLORS.white : COLORS.primary}
                                                    />
                                                </View>
                                                <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                                                    {model.model_name}
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
                                    <Text style={styles.noResultsText}>No models found</Text>
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
    container: { marginBottom: 8, width: '100%' },
    label: { fontSize: 13, fontWeight: '500', color: COLORS.text.secondary, marginBottom: -2 },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 5,
        paddingHorizontal: 12,
        height: 40,
        backgroundColor: '#F9FAFB',
    },
    disabledTrigger: { opacity: 0.5, backgroundColor: COLORS.backgroundMuted },
    triggerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    triggerText: { fontSize: 14, fontWeight: '500', color: COLORS.text.primary },
    placeholderText: { fontSize: 14, color: COLORS.text.placeholder, fontWeight: '400' },

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
        maxHeight: '90%',
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
    searchInput: { flex: 1, fontSize: 15, color: COLORS.text.primary },

    listContent: { paddingBottom: 20 },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
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
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text.secondary,
    },
    selectedItemText: {
        color: COLORS.primary,
        fontWeight: '700',
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

export default ModelSelector;
