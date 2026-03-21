import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ComparisonVehicle } from '../../../types/compare-detail.types';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';

interface Props {
    vehicle1: ComparisonVehicle;
    vehicle2: ComparisonVehicle;
}

const ComparisonVehicleHeader: React.FC<Props> = ({ vehicle1, vehicle2 }) => {
    return (
        <View style={styles.container}>
            <View style={styles.carBooth}>
                <View style={styles.imageOverlayContainer}>
                    <Image source={{ uri: vehicle1.image }} style={styles.carImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)']}
                        style={styles.imageOverlay}
                    />
                </View>
                <View style={styles.carInfo}>
                    <Text style={styles.carTitle} numberOfLines={2}>{vehicle1.name}</Text>
                    <View style={styles.yearBadge}>
                        <Text style={styles.yearText}>{vehicle1.year}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.vsContainer}>
                <View style={styles.vsLine} />
                <View style={styles.vsCircle}>
                    <Text style={styles.vsText}>VS</Text>
                </View>
                <View style={styles.vsLine} />
            </View>

            <View style={styles.carBooth}>
                <View style={styles.imageOverlayContainer}>
                    <Image source={{ uri: vehicle2.image }} style={styles.carImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)']}
                        style={styles.imageOverlay}
                    />
                </View>
                <View style={styles.carInfo}>
                    <Text style={styles.carTitle} numberOfLines={2}>{vehicle2.name}</Text>
                    <View style={styles.yearBadge}>
                        <Text style={styles.yearText}>{vehicle2.year}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    carBooth: { 
        flex: 1,
        alignItems: 'center',
    },
    imageOverlayContainer: {
        width: '100%',
        height: 90,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 12,
    },
    carImage: { 
        width: '100%', 
        height: '100%', 
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    carInfo: {
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    carTitle: { 
        fontSize: 14, 
        fontWeight: '900',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 6,
    },
    yearBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    yearText: { 
        fontSize: 10, 
        color: COLORS.primary,
        fontWeight: '800',
    },
    vsContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
    },
    vsLine: {
        width: 1,
        height: 20,
        backgroundColor: '#E2E8F0',
    },
    vsCircle: { 
        width: 32, 
        height: 32, 
        borderRadius: 16, 
        backgroundColor: COLORS.primary, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 3,
        borderColor: COLORS.white,
        marginVertical: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    vsText: { 
        color: '#fff', 
        fontSize: 9, 
        fontWeight: '900' 
    },
});

export default ComparisonVehicleHeader;
