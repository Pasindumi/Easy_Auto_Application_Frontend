import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ComparisonVehicle } from '../../../types/compare-detail.types';

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

    return (
        <View style={styles.detailRow}>
            {/* LEFT SIDE */}
            <View style={styles.detailColumn}>
                <Text style={styles.price}>{vehicle1.price}</Text>
                {price1 < price2 ? (
                    <Text style={styles.greenText}>● Lower price</Text>
                ) : price1 > price2 ? (
                    <Text style={styles.redText}>● Higher price</Text>
                ) : null}

                <Text style={styles.spec}>{vehicle1.km}</Text>
                {km1 < km2 ? (
                    <Text style={styles.greenText}>● Less driven</Text>
                ) : km1 > km2 ? (
                    <Text style={styles.redText}>● More driven</Text>
                ) : null}

                <Text style={styles.spec}>{vehicle1.transmission}</Text>
                <Text style={styles.spec}>Fuel Type - {vehicle1.fuelType}</Text>
                <Text style={styles.spec}>Condition - {vehicle1.condition}</Text>
                <Text style={styles.spec}>Year - {vehicle1.year}</Text>
                <Text style={styles.spec}>Fuel Economy - {vehicle1.fuelEconomy}</Text>

                <View style={styles.ratingRow}>
                    <Text style={styles.spec}>Seller Rating</Text>
                    <Text style={styles.star}>{'★'.repeat(vehicle1.rating) + '☆'.repeat(5 - vehicle1.rating)}</Text>
                </View>
            </View>

            {/* RIGHT SIDE */}
            <View style={styles.detailColumn}>
                <Text style={styles.price}>{vehicle2.price}</Text>
                {price2 < price1 ? (
                    <Text style={styles.greenText}>● Lower price</Text>
                ) : price2 > price1 ? (
                    <Text style={styles.redText}>● Higher price</Text>
                ) : null}

                <Text style={styles.spec}>{vehicle2.km}</Text>
                {km2 < km1 ? (
                    <Text style={styles.greenText}>● Less driven</Text>
                ) : km2 > km1 ? (
                    <Text style={styles.redText}>● More driven</Text>
                ) : null}

                <Text style={styles.spec}>{vehicle2.transmission}</Text>
                <Text style={styles.spec}>Fuel Type - {vehicle2.fuelType}</Text>
                <Text style={styles.spec}>Condition - {vehicle2.condition}</Text>
                <Text style={styles.spec}>Year - {vehicle2.year}</Text>
                <Text style={styles.spec}>Fuel Economy - {vehicle2.fuelEconomy}</Text>

                <View style={styles.ratingRow}>
                    <Text style={styles.spec}>Seller Rating</Text>
                    <Text style={styles.star}>{'★'.repeat(vehicle2.rating) + '☆'.repeat(5 - vehicle2.rating)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    detailRow: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
    detailColumn: { width: '48%' },
    price: { fontWeight: '700', fontSize: 13, marginBottom: 3 },
    greenText: { color: 'green', fontSize: 11, marginBottom: 8 },
    redText: { color: 'red', fontSize: 11, marginBottom: 8 },
    spec: { fontSize: 11, marginBottom: 6, color: '#222' },
    ratingRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    star: { color: '#F59E0B', fontSize: 12 },
});

export default ComparisonSpecsTable;
