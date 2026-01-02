import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { headerSectionStyles } from '../../styles/headerSectionStyles';

const VEHICLE_TYPES = [
    { id: 'Car', label: 'Cars', icon: 'directions-car' },
    { id: 'Motorbike', label: 'Motorbikes', icon: 'two-wheeler' },
    { id: 'Three Wheeler', label: 'Three Wheelers', icon: 'electric-rickshaw' }, // Using closest icon
    { id: 'Bicycle', label: 'Bicycles', icon: 'pedal-bike' },
    { id: 'Van', label: 'Vans', icon: 'airport-shuttle' },
    { id: 'Bus', label: 'Buses', icon: 'directions-bus' },
    { id: 'Lorry', label: 'Lorries & Trucks', icon: 'local-shipping' },
];

export default function SelectVehicleTypeScreen() {
    const router = useRouter();

    const handleSelect = (type: string) => {
        router.push({
            pathname: '/cars/sell-car',
            params: { vehicleType: type }
        });
    };

    const renderItem = ({ item }: { item: typeof VEHICLE_TYPES[0] }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelect(item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '15' }]}>
                {/* @ts-ignore - MaterialIcons name compatibility */}
                <MaterialIcons name={item.icon} size={32} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.subLabel}>Sell your {item.label.toLowerCase()}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.text.gray} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Select Vehicle Type" />

            {/* Unified Sub-Header */}
            <View style={headerSectionStyles.headerWrap}>
                <View style={headerSectionStyles.header}>
                    <MaterialIcons name="add-circle-outline" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
                    <Text style={headerSectionStyles.headerTitle}>What are you selling?</Text>
                </View>
            </View>

            <FlatList
                data={VEHICLE_TYPES}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    subLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
});
