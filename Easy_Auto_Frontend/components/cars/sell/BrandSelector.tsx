import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView, TextInput, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface Brand {
    id: string;
    brand_name: string;
    brand_image?: string;
}

interface Props {
    label: string;
    value: string;
    brands: Brand[];
    onSelect: (value: string) => void;
    disabled?: boolean;
    loading?: boolean;
}

const BrandSelector: React.FC<Props> = ({ label, value, brands, onSelect, disabled, loading }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();

    const safeBrands = brands || [];

    const filteredBrands = useMemo(() => {
        if (!searchQuery) return safeBrands;
        return safeBrands.filter(b =>
            b.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [safeBrands, searchQuery]);

    const handleSelect = (brandName: string) => {
        onSelect(brandName);
        setModalVisible(false);
        setSearchQuery('');
    };

    const selectedBrand = useMemo(() =>
        safeBrands.find(b => b.brand_name === value),
        [safeBrands, value]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.trigger, disabled && styles.disabledTrigger]}
                onPress={() => !disabled && setModalVisible(true)}
                disabled={disabled}
            >
                <View style={styles.triggerContent}>
                    {selectedBrand ? (
                        <>
                            {selectedBrand.brand_image ? (
                                <Image
                                    source={{ uri: selectedBrand.brand_image }}
                                    style={styles.triggerLogo}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View style={styles.triggerLogoPlaceholder}>
                                    <Text style={styles.logoInitial}>{selectedBrand.brand_name[0]}</Text>
                                </View>
                            )}
                            <Text style={styles.triggerText} numberOfLines={1}>{selectedBrand.brand_name}</Text>
                        </>
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
                            <Text style={styles.modalTitle}>Select Brand</Text>
                            <View style={styles.searchContainer}>
                                <Ionicons name="search" size={20} color={COLORS.text.muted} style={styles.searchIcon} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search brand..."
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
                            contentContainerStyle={styles.gridContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.grid}>
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand) => (
                                        <TouchableOpacity
                                            key={brand.id}
                                            style={[
                                                styles.brandCard,
                                                value === brand.brand_name && styles.selectedBrandCard
                                            ]}
                                            onPress={() => handleSelect(brand.brand_name)}
                                        >
                                            <View style={styles.logoContainer}>
                                                {brand.brand_image ? (
                                                    <Image
                                                        source={{ uri: brand.brand_image }}
                                                        style={styles.brandLogo}
                                                        resizeMode="contain"
                                                    />
                                                ) : (
                                                    <View style={styles.brandLogoPlaceholder}>
                                                        <Text style={styles.brandInitial}>{brand.brand_name[0]}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text
                                                style={[
                                                    styles.brandName,
                                                    value === brand.brand_name && styles.selectedBrandName
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {brand.brand_name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <View style={styles.noResults}>
                                        <Ionicons name="search-outline" size={48} color={COLORS.border} />
                                        <Text style={styles.noResultsText}>No brands found</Text>
                                    </View>
                                )}
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
    container: { marginBottom: 20, width: '100%' },
    label: { fontSize: 13, fontWeight: '500', color: COLORS.text.primary, marginBottom: 6 },
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
    triggerLogo: { width: 20, height: 20, marginRight: 10 },
    triggerLogoPlaceholder: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    logoInitial: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
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

    gridContent: { paddingBottom: 20 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 8,
        gap: 12,
    },
    brandCard: {
        width: (width - 48 - (12 * 2)) / 3, // Full width minus modal padding minus gaps
        aspectRatio: 0.9, // Slightly taller than wide for better text fit
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    selectedBrandCard: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.primary,
    },
    logoContainer: {
        width: 48,
        height: 48,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandLogo: { width: '100%', height: '100%' },
    brandLogoPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    brandInitial: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
    brandName: { fontSize: 13, fontWeight: '600', color: COLORS.text.secondary, textAlign: 'center' },
    selectedBrandName: { color: COLORS.primary },

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

export default BrandSelector;
