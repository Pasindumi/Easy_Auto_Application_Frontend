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

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Ionicons name={step === 'PROVINCE' ? "close" : "arrow-back"} size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.title}>
                {searchQuery ? 'Search Location' :
                    step === 'PROVINCE' ? 'Select Province' :
                        step === 'DISTRICT' ? `Districts in ${selectedProvince?.name}` :
                            `Cities in ${selectedDistrict?.name}`}
            </Text>
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
        let onPress = () => { };

        if (searchQuery) {
            label = `${item.cityName}, ${item.districtName}`;
            onPress = () => handleSelectCity(item.cityName, item.districtName);
        } else if (step === 'PROVINCE') {
            label = item.name;
            onPress = () => handleSelectProvince(item);
        } else if (step === 'DISTRICT') {
            label = item.name;
            onPress = () => handleSelectDistrict(item);
        } else {
            label = item;
            onPress = () => handleSelectCity(item, selectedDistrict!.name);
        }

        return (
            <TouchableOpacity style={styles.listItem} onPress={onPress}>
                <Text style={styles.listText}>{label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
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
    container: { flex: 1, backgroundColor: 'white' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    backButton: { padding: 8 },
    title: { fontSize: 18, fontWeight: '700', color: '#111827' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 48
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#111827' },
    listContent: { paddingHorizontal: 16 },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6'
    },
    listText: { fontSize: 16, color: '#374151', fontWeight: '500' },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#9CA3AF', fontSize: 16 }
});

export default LocationModal;
