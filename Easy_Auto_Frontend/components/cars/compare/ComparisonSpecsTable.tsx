import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ComparisonVehicle } from '../../../types/compare-detail.types';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';

interface Props {
    vehicle1: ComparisonVehicle;
    vehicle2: ComparisonVehicle;
}

const ComparisonSpecsTable: React.FC<Props> = ({ vehicle1, vehicle2 }) => {
    // Helper to parse "LKR 5,000,000" -> 5000000
    const parsePrice = (priceStr: string) => {
        return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
    };

    // Helper to parse "50,000 km" -> 50000
    const parseKm = (kmStr: string) => {
        return parseInt(kmStr.replace(/[^0-9]/g, ''), 10) || 0;
    };

    const price1 = parsePrice(vehicle1.price);
    const price2 = parsePrice(vehicle2.price);

    const km1 = parseKm(vehicle1.km);
    const km2 = parseKm(vehicle2.km);

    const SpecRow = ({ label, val1, val2, isBetter1, isBetter2, icon }: { 
        label: string, 
        val1: string, 
        val2: string, 
        isBetter1?: boolean, 
        isBetter2?: boolean,
        icon: any 
    }) => (
        <View style={styles.specRow}>
            <View style={styles.specSide}>
                <Text style={[styles.specVal, isBetter1 && styles.betterVal]}>{val1}</Text>
                {isBetter1 && (
                    <View style={styles.winnerBadge}>
                        <Ionicons name="checkmark-circle" size={10} color="#10B981" />
                        <Text style={styles.winnerText}>Better</Text>
                    </View>
                )}
            </View>
            
            <View style={styles.specCenter}>
                <View style={[styles.centerIconBg, { backgroundColor: '#F8FAFC' }]}>
                    <Ionicons name={icon} size={14} color="#94A3B8" />
                </View>
                <Text style={styles.specLabel}>{label}</Text>
            </View>

            <View style={styles.specSide}>
                <Text style={[styles.specVal, isBetter2 && styles.betterVal]}>{val2}</Text>
                {isBetter2 && (
                    <View style={styles.winnerBadge}>
                        <Ionicons name="checkmark-circle" size={10} color="#10B981" />
                        <Text style={styles.winnerText}>Better</Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tableHeader}>
                <Text style={styles.headerTitle}>SIDE-BY-SIDE ANALYSIS</Text>
            </View>
            
            <SpecRow 
                label="Price"
                val1={vehicle1.price}
                val2={vehicle2.price}
                isBetter1={price1 < price2}
                isBetter2={price2 < price1}
                icon="pricetag-outline"
            />
            
            <SpecRow 
                label="Mileage"
                val1={vehicle1.km}
                val2={vehicle2.km}
                isBetter1={km1 < km2}
                isBetter2={km2 < km1}
                icon="speedometer-outline"
            />
            
            <SpecRow 
                label="Transmission"
                val1={vehicle1.transmission}
                val2={vehicle2.transmission}
                icon="cog-outline"
            />
            
            <SpecRow 
                label="Fuel Type"
                val1={vehicle1.fuelType}
                val2={vehicle2.fuelType}
                icon="water-outline"
            />
            
            <SpecRow 
                label="Condition"
                val1={vehicle1.condition}
                val2={vehicle2.condition}
                icon="shield-outline"
            />

            <SpecRow 
                label="Fuel Economy"
                val1={vehicle1.fuelEconomy || 'N/A'}
                val2={vehicle2.fuelEconomy || 'N/A'}
                icon="leaf-outline"
            />

            {/* Rating Section */}
            <View style={styles.ratingSection}>
                <View style={styles.ratingCol}>
                    <Text style={styles.ratingVal}>{vehicle1.rating}/5</Text>
                    <Text style={styles.stars}>{'★'.repeat(vehicle1.rating) + '☆'.repeat(5 - vehicle1.rating)}</Text>
                </View>
                <Text style={styles.ratingLabel}>SELLER RATING</Text>
                <View style={styles.ratingCol}>
                    <Text style={styles.ratingVal}>{vehicle2.rating}/5</Text>
                    <Text style={styles.stars}>{'★'.repeat(vehicle2.rating) + '☆'.repeat(5 - vehicle2.rating)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    tableHeader: {
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1.5,
    },
    specRow: { 
        flexDirection: 'row', 
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
    },
    specSide: { 
        flex: 1, 
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    specCenter: { 
        width: 80, 
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerIconBg: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    specLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#64748B',
        textTransform: 'uppercase',
    },
    specVal: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        textAlign: 'center',
    },
    betterVal: {
        color: '#10B981',
    },
    winnerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginTop: 4,
        gap: 3,
    },
    winnerText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#10B981',
        textTransform: 'uppercase',
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
        gap: 20,
    },
    ratingCol: {
        alignItems: 'center',
    },
    ratingVal: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1E293B',
    },
    stars: {
        fontSize: 12,
        color: '#F59E0B',
        marginTop: 2,
    },
    ratingLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

export default ComparisonSpecsTable;
