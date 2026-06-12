import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView
} from 'react-native';
import { ALL_CITIES, SRI_LANKA_LOCATIONS, Province, District } from '../../constants/Locations';
import COLORS from '@/constants/Colors';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (location: string) => void;
}

type SelectionStep = 'PROVINCE' | 'DISTRICT' | 'CITY';

const LocationModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {
    const [step, setStep] = useState<SelectionStep>('PROVINCE');
    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSearch = useMemo(() => {
        if (!searchQuery) return [];
        return ALL_CITIES.filter(item =>
            item.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.districtName.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 20); // Limit results for performance
    }, [searchQuery]);

    const handleSelectProvince = (province: Province) => {
        setSelectedProvince(province);
        setStep('DISTRICT');
    };

    const handleSelectDistrict = (district: District) => {
        setSelectedDistrict(district);
        setStep('CITY');
    };

    const handleSelectCity = (city: string, districtName: string) => {
        onSelect(`${city}, ${districtName}`);
        resetAndClose();
    };

    const resetAndClose = () => {
        setStep('PROVINCE');
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSearchQuery('');
        onClose();
    };

    const goBack = () => {
        if (step === 'CITY') setStep('DISTRICT');
        else if (step === 'DISTRICT') setStep('PROVINCE');
        else onClose();
    };

    const renderStepIndicator = () => (
        <View style={styles.stepContainer}>
            <View style={styles.stepItem}>
                <Text style={[styles.stepText, step === 'PROVINCE' && styles.stepTextActive]}>Province</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={COLORS.text.muted} style={styles.stepDivider} />
            <View style={styles.stepItem}>
                <Text style={[styles.stepText, step === 'DISTRICT' && styles.stepTextActive]}>District</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={COLORS.text.muted} style={styles.stepDivider} />
            <View style={styles.stepItem}>
                <Text style={[styles.stepText, step === 'CITY' && styles.stepTextActive]}>City</Text>
            </View>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Ionicons name={step === 'PROVINCE' ? "close" : "arrow-back"} size={22} color={COLORS.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
                <Text style={styles.title}>
                    {searchQuery ? 'Search Location' :
                        step === 'PROVINCE' ? 'Select Province' :
                            step === 'DISTRICT' ? selectedProvince?.name :
                                selectedDistrict?.name}
                </Text>
                {!searchQuery && renderStepIndicator()}
            </View>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
                style={styles.searchInput}
                placeholder="Search city or district..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            )}
        </View>
    );

    const renderItem = ({ item }: { item: any }) => {
        let label = '';
        let subLabel = '';
        let icon: any = 'map-outline';
        let onPress = () => { };

        if (searchQuery) {
            label = item.cityName;
            subLabel = item.districtName;
            icon = 'location';
            onPress = () => handleSelectCity(item.cityName, item.districtName);
        } else if (step === 'PROVINCE') {
            label = item.name;
            subLabel = `${item.districts?.length || 0} Districts`;
            icon = 'earth-outline';
            onPress = () => handleSelectProvince(item);
        } else if (step === 'DISTRICT') {
            label = item.name;
            subLabel = `${item.cities?.length || 0} Cities`;
            icon = 'navigate-outline';
            onPress = () => handleSelectDistrict(item);
        } else {
            label = item;
            subLabel = selectedDistrict!.name;
            icon = 'location-outline';
            onPress = () => handleSelectCity(item, selectedDistrict!.name);
        }

        return (
            <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.7}>
                <View style={styles.itemIconBg}>
                    <Ionicons name={icon} size={20} color={COLORS.primary} />
                </View>
                <View style={styles.itemTextContent}>
                    <Text style={styles.listText}>{label}</Text>
                    <Text style={styles.listSubText}>{subLabel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.borderDark} />
            </TouchableOpacity>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={styles.container}>
                {renderHeader()}
                {renderSearchBar()}

                <FlatList
                    data={searchQuery ? filteredSearch :
                        step === 'PROVINCE' ? SRI_LANKA_LOCATIONS :
                            step === 'DISTRICT' ? selectedProvince?.districts :
                                selectedDistrict?.cities}
                    keyExtractor={(item, index) => searchQuery ? item.fullLocation :
                        step === 'CITY' ? `${item}-${index}` : item.name}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No locations found</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    headerTitleContainer: {
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        padding: 8,
        backgroundColor: COLORS.backgroundMuted,
        borderRadius: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    stepItem: {
        paddingHorizontal: 4,
    },
    stepText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.text.muted,
        textTransform: 'uppercase',
    },
    stepTextActive: {
        color: COLORS.primary,
    },
    stepDivider: {
        marginHorizontal: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        margin: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        height: 52,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 8,
    },
    itemIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    itemTextContent: {
        flex: 1,
    },
    listText: {
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '700',
    },
    listSubText: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: '500',
        marginTop: 2,
    },
    emptyContainer: {
        padding: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: COLORS.text.muted,
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    }
});

export default LocationModal;
