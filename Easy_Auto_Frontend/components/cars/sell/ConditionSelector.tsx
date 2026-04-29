import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '@/constants/Colors';

interface ConditionOption {
    label: string;
    value: string;
    description?: string;
    icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
    disabled?: boolean;
}

const ConditionSelector: React.FC<Props> = ({ label, value, options, onSelect, disabled }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const insets = useSafeAreaInsets();

    // Map labels to icons and descriptions for better UI
    const getConditionDetails = (label: string): { description: string, icon: keyof typeof Ionicons.glyphMap } => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('brand new')) {
            return {
                description: 'Fresh from the dealership, ready for its first owner.',
                icon: 'star'
            };
        } else if (lowerLabel.includes('reconditioned')) {
            return {
                description: 'Premium imports, carefully restored to look and feel like new.',
                icon: 'refresh'
            };
        } else if (lowerLabel.includes('used')) {
            return {
                description: 'Well-maintained and pre-owned, ready for its next journey.',
                icon: 'car'
            };
        }
        return {
            description: 'Standard vehicle condition.',
            icon: 'checkmark-circle'
        };
    };

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
                    {value ? (
                        <>
                            <Text style={styles.triggerText} numberOfLines={1}>{value}</Text>
                        </>
                    ) : (
                        <Text style={styles.placeholderText}>Select...</Text>
                    )}
                </View>
                <Ionicons name="chevron-down" size={20} color={disabled ? COLORS.text.placeholder : COLORS.text.muted} />
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.dismissArea} onPress={() => setModalVisible(false)} />
                    <View style={[
                        styles.modalContent,
                        { paddingBottom: Math.max(insets.bottom, 24) }
                    ]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.headerIndicator} />
                            <Text style={styles.modalTitle}>Condition</Text>
                            <Text style={styles.modalSubtitle}>How would you describe the car's state?</Text>
                        </View>

                        <ScrollView contentContainerStyle={styles.optionsList} showsVerticalScrollIndicator={false}>
                            {options.map((opt) => {
                                const details = getConditionDetails(opt.label);
                                const isSelected = value === opt.value;

                                return (
                                    <TouchableOpacity
                                        key={opt.value}
                                        style={[
                                            styles.card,
                                            isSelected && styles.selectedCard
                                        ]}
                                        onPress={() => handleSelect(opt.value)}
                                    >
                                        <View style={[styles.iconContainer, isSelected && styles.selectedIconContainer]}>
                                            <Ionicons
                                                name={details.icon}
                                                size={32}
                                                color={isSelected ? COLORS.white : COLORS.primary}
                                            />
                                        </View>
                                        <View style={styles.cardTextContainer}>
                                            <Text style={[styles.cardTitle, isSelected && styles.selectedCardTitle]}>
                                                {opt.label}
                                            </Text>
                                            <Text style={[styles.cardDescription, isSelected && styles.selectedCardDescription]}>
                                                {details.description}
                                            </Text>
                                        </View>
                                        {isSelected && (
                                            <View style={styles.checkBadge}>
                                                <Ionicons name="checkmark" size={16} color={COLORS.white} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
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
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, marginLeft: 2 },
    triggerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    triggerIcon: { marginRight: 8 },
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
        maxHeight: '85%',
    },
    modalHeader: { alignItems: 'center', marginBottom: 24 },
    headerIndicator: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: 16 },
    modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary, marginBottom: 4 },
    modalSubtitle: { fontSize: 14, color: COLORS.text.muted },

    optionsList: { gap: 12 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        elevation: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    selectedIconContainer: {
        backgroundColor: COLORS.primary,
    },
    cardTextContainer: { flex: 1 },
    cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text.primary, marginBottom: 4 },
    selectedCardTitle: { color: COLORS.primary },
    cardDescription: { fontSize: 13, color: COLORS.text.muted, lineHeight: 18 },
    selectedCardDescription: { color: COLORS.text.secondary },

    checkBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 12,
        right: 12,
    },

    closeButton: {
        marginTop: 24,
        alignItems: 'center',
        paddingVertical: 12,
    },
    closeButtonText: { fontSize: 16, fontWeight: '600', color: COLORS.text.muted },
});

export default ConditionSelector;
