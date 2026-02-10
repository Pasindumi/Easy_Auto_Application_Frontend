import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import COLORS from '../../../constants/Colors';
import { ENDPOINTS } from '../../../constants/API';

interface CarSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (car: any) => void;
    title?: string;
}

const CarSelectionModal: React.FC<CarSelectionModalProps> = ({ visible, onClose, onSelect, title = "Select Car" }) => {
    const [search, setSearch] = useState('');
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchCars();
        }
    }, [visible, search]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            let url = `${ENDPOINTS.CARS}?limit=20&status=ACTIVE`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }
            const response = await fetch(url);
            const json = await response.json();
            if (json.success) {
                setCars(json.data);
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.carItem} onPress={() => { onSelect(item); onClose(); }}>
            <Image
                source={{ uri: item.AdImage?.[0]?.image_url || 'https://via.placeholder.com/150' }}
                style={styles.carImage}
            />
            <View style={styles.carInfo}>
                <Text style={styles.carName} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.carPrice}>LKR {item.price?.toLocaleString()}</Text>
                <Text style={styles.carDetails}>{item.CarDetails?.year} • {item.CarDetails?.condition}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.gray} />
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={COLORS.text.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.text.gray} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search cars..."
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={cars}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No cars found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F6FA',
        margin: 16,
        paddingHorizontal: 12,
        borderRadius: 10,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text.primary,
    },
    listContent: {
        paddingBottom: 20,
    },
    carItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E6E8EE',
    },
    carImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    carInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    carName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 2,
    },
    carPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 2,
    },
    carDetails: {
        fontSize: 12,
        color: COLORS.text.gray,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.text.gray,
    },
});

export default CarSelectionModal;
