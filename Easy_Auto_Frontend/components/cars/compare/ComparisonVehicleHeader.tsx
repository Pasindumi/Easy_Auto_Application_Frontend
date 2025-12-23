import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ComparisonVehicle } from '../../../types/compare-detail.types';

interface Props {
    vehicle1: ComparisonVehicle;
    vehicle2: ComparisonVehicle;
}

const ComparisonVehicleHeader: React.FC<Props> = ({ vehicle1, vehicle2 }) => {
    return (
        <View style={styles.imageRow}>
            <View style={styles.carImageBox}>
                <Image source={{ uri: vehicle1.image }} style={styles.carImage} />
                <Text style={styles.carTitle}>{vehicle1.name}</Text>
                <Text style={styles.carYear}>{vehicle1.year}</Text>
            </View>

            <View style={styles.vsCircle}>
                <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.carImageBox}>
                <Image source={{ uri: vehicle2.image }} style={styles.carImage} />
                <Text style={styles.carTitle}>{vehicle2.name}</Text>
                <Text style={styles.carYear}>{vehicle2.year}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    carImageBox: { alignItems: 'center', width: '40%' },
    carImage: { width: '100%', height: 70, resizeMode: 'cover', borderRadius: 10 },
    carTitle: { fontSize: 12, marginTop: 5, fontWeight: '600' },
    carYear: { fontSize: 11, color: '#777' },
    vsCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
    vsText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});

export default ComparisonVehicleHeader;
