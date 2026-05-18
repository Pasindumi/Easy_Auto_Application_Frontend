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
                    <View style={[styles.winnerBadge, { backgroundColor: '#D1FAE5' }]}>
                        <Ionicons name="trophy" size={11} color="#059669" />
                        <Text style={[styles.winnerText, { color: '#059669' }]}>Winner</Text>
                    </View>
                )}
            </View>

            <View style={styles.specCenter}>
                <View style={styles.centerIconBg}>
                    <Ionicons name={icon} size={13} color={COLORS.primary} />
                </View>
                <Text style={styles.specLabel}>{label}</Text>
            </View>

            <View style={styles.specSide}>
                <Text style={[styles.specVal, isBetter2 && styles.betterVal]}>{val2}</Text>
                {isBetter2 && (
                    <View style={[styles.winnerBadge, { backgroundColor: '#D1FAE5' }]}>
                        <Ionicons name="trophy" size={11} color="#059669" />
                        <Text style={[styles.winnerText, { color: '#059669' }]}>Winner</Text>
                    </View>
                )}
            </View>
        </View>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>{title}</Text>
        </View>
    );

    // Get all unique attribute names from both vehicles
    const allAttributeNames = Array.from(new Set([
        ...Object.keys(vehicle1.attributes),
        ...Object.keys(vehicle2.attributes)
    ]));

    return (
        <View style={styles.container}>
            <View style={styles.tableHeader}>
                <Text style={styles.headerTitle}>SIDE-BY-SIDE ANALYSIS</Text>
            </View>

            {/* --- BASIC DETAILS --- */}
            <SectionHeader title="Basic Details" />
            <SpecRow
                label="Price"
                val1={vehicle1.price}
                val2={vehicle2.price}
                isBetter1={price1 < price2}
                isBetter2={price2 < price1}
                icon="pricetag-outline"
            />
            <SpecRow
                label="Location"
                val1={vehicle1.location}
                val2={vehicle2.location}
                icon="location-outline"
            />
            <SpecRow
                label="Verified"
                val1={vehicle1.sellerVerified ? "Yes" : "No"}
                val2={vehicle2.sellerVerified ? "Yes" : "No"}
                isBetter1={vehicle1.sellerVerified && !vehicle2.sellerVerified}
                isBetter2={vehicle2.sellerVerified && !vehicle1.sellerVerified}
                icon="checkmark-circle-outline"
            />

            {/* --- CAR DETAILS --- */}
            <SectionHeader title="Car Details" />
            <SpecRow
                label="Condition"
                val1={vehicle1.condition}
                val2={vehicle2.condition}
                icon="shield-outline"
            />
            <SpecRow
                label="Brand"
                val1={vehicle1.brand}
                val2={vehicle2.brand}
                icon="car-outline"
            />
            <SpecRow
                label="Model"
                val1={vehicle1.model}
                val2={vehicle2.model}
                icon="car-sport-outline"
            />
            <SpecRow
                label="Year"
                val1={vehicle1.year}
                val2={vehicle2.year}
                isBetter1={parseInt(vehicle1.year) > parseInt(vehicle2.year)}
                isBetter2={parseInt(vehicle2.year) > parseInt(vehicle1.year)}
                icon="calendar-outline"
            />

            {/* --- OTHER SPECIFICATIONS --- */}
            <SectionHeader title="Other Specifications" />

            {/* Dynamic Attributes from Admin/Seller Input */}
            {allAttributeNames.map(attrName => (
                <SpecRow
                    key={attrName}
                    label={attrName}
                    val1={vehicle1.attributes[attrName] || 'N/A'}
                    val2={vehicle2.attributes[attrName] || 'N/A'}
                    icon="list-outline"
                />
            ))}

            {/* Rating Section */}
            <SectionHeader title="Seller Information" />
            <View style={styles.ratingSection}>
                <View style={styles.ratingCol}>
                    {vehicle1.rating > 0 ? (
                        <>
                            <Text style={styles.ratingVal}>{vehicle1.rating}/5</Text>
                            <Text style={styles.stars}>{'★'.repeat(Math.round(vehicle1.rating)) + '☆'.repeat(5 - Math.round(vehicle1.rating))}</Text>
                        </>
                    ) : (
                        <Text style={styles.ratingVal}>Not rated yet</Text>
                    )}
                </View>
                <Text style={styles.ratingLabel}>SELLER RATING</Text>
                <View style={styles.ratingCol}>
                    {vehicle2.rating > 0 ? (
                        <>
                            <Text style={styles.ratingVal}>{vehicle2.rating}/5</Text>
                            <Text style={styles.stars}>{'★'.repeat(Math.round(vehicle2.rating)) + '☆'.repeat(5 - Math.round(vehicle2.rating))}</Text>
                        </>
                    ) : (
                        <Text style={styles.ratingVal}>Not rated yet</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
        paddingVertical: 8,
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
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
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
        backgroundColor: '#F0FDF4',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 5,
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
        paddingVertical: 16,
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
    },
    sectionHeader: {
        backgroundColor: '#F8FAFC',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: -16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    sectionHeaderTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    }
});

export default ComparisonSpecsTable;
