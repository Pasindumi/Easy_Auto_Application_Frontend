import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '@/constants/Colors';

export interface SelectionOption {
    label: string;
    value: string;
    icon?: keyof typeof Ionicons.glyphMap;
    description?: string;
}

interface Props {
    label: string;
    value: string;
    options: SelectionOption[];
    onSelect: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    triggerIcon?: keyof typeof Ionicons.glyphMap;
    layout?: 'list' | 'grid';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const MODAL_PADDING = 24;
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - (MODAL_PADDING * 2) - (GRID_GAP * 2)) / 3;

const OptionSelector: React.FC<Props> = ({
    label, value, options, onSelect, placeholder = "Select...",
    disabled, loading, triggerIcon, layout = 'list'
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const insets = useSafeAreaInsets();

    const selectedOption = options.find(o => o.value === value);

    const handleSelect = (val: string) => {
        onSelect(val);
        setModalVisible(false);
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
                    {triggerIcon && (
                        <Ionicons name={triggerIcon} size={20} color={COLORS.text.muted} style={styles.triggerIcon} />
                    )}
                    {selectedOption ? (
                        <Text style={styles.triggerText}>{selectedOption.label}</Text>
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
                        </View>

                        <ScrollView
                            contentContainerStyle={layout === 'list' ? styles.listContent : styles.gridContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={layout === 'list' ? styles.list : styles.grid}>
                                {options.map((option) => {
                                    const isSelected = value === option.value;

                                    if (layout === 'grid') {
                                        return (
                                            <TouchableOpacity
                                                key={option.value}
                                                style={[
                                                    styles.gridItem,
                                                    isSelected && styles.selectedGridItem
                                                ]}
                                                onPress={() => handleSelect(option.value)}
                                            >
                                                <View style={[styles.gridIconContainer, isSelected && styles.selectedGridIconContainer]}>
                                                    <Ionicons
                                                        name={option.icon || 'car-outline'}
                                                        size={24}
                                                        color={isSelected ? COLORS.white : COLORS.primary}
                                                    />
                                                </View>
                                                <Text style={[styles.gridText, isSelected && styles.selectedGridText]} numberOfLines={2}>
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }

                                    return (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={[
                                                styles.listItem,
                                                isSelected && styles.selectedListItem
                                            ]}
                                            onPress={() => handleSelect(option.value)}
                                        >
                                            <View style={styles.itemMain}>
                                                <View style={[styles.itemIcon, isSelected && styles.selectedItemIcon]}>
                                                    <Ionicons
                                                        name={option.icon || 'radio-button-off'}
                                                        size={18}
                                                        color={isSelected ? COLORS.white : COLORS.primary}
                                                    />
                                                </View>
                                                <View>
                                                    <Text style={[styles.itemLabel, isSelected && styles.selectedItemLabel]}>
                                                        {option.label}
                                                    </Text>
                                                    {option.description && (
                                                        <Text style={styles.itemDescription}>{option.description}</Text>
                                                    )}
                                                </View>
                                            </View>
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
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

    listContent: { paddingBottom: 20 },
    list: {},
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: '#F9FAFB',
    },
    selectedListItem: {
        backgroundColor: COLORS.primaryLight,
    },
    itemMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    itemIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    selectedItemIcon: { backgroundColor: COLORS.primary },
    itemLabel: { fontSize: 16, fontWeight: '600', color: COLORS.text.secondary },
    selectedItemLabel: { color: COLORS.primary, fontWeight: '800' },
    itemDescription: { fontSize: 12, color: COLORS.text.muted, marginTop: 2 },

    gridContent: { paddingBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
    gridItem: {
        width: GRID_ITEM_WIDTH,
        aspectRatio: 0.9,
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'transparent',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    selectedGridItem: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
        elevation: 4,
        shadowOpacity: 0.1,
    },
    gridIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectedGridIconContainer: { backgroundColor: COLORS.primary },
    gridText: { fontSize: 11, fontWeight: '700', color: COLORS.text.secondary, textAlign: 'center' },
    selectedGridText: { color: COLORS.primary, fontWeight: '800' },

    closeButton: {
        marginTop: 10,
        alignItems: 'center',
        paddingVertical: 12,
    },
    closeButtonText: { fontSize: 16, fontWeight: '600', color: COLORS.text.muted },
});

export default OptionSelector;
