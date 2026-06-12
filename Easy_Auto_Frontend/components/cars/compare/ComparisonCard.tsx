import { SimilarComparison } from '@/types/compare-detail.types';
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface ComparisonCardProps {
    item: SimilarComparison;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ item }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/cars/compare-cars-detail',
            params: { id1: item.id1, id2: item.id2 }
        });
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={handlePress}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: '#F8FAFC' }]}>
                    <Text style={styles.badgeText}>PREVIOUS</Text>
                </View>
                <View style={styles.viewsContainer}>
                    <Ionicons name="time-outline" size={12} color="#94A3B8" />
                    <Text style={styles.viewsText}>Recently compared</Text>
                </View>
            </View>

            <View style={styles.compareBody}>
                <View style={styles.carSide}>
                    <View style={styles.imgWrapper}>
                        <Image source={{ uri: item.leftImage }} style={styles.carImage} resizeMode="cover" />
                    </View>
                    <Text style={styles.carName} numberOfLines={1}>{item.leftName}</Text>
                    <Text style={styles.carYear}>Vehicle A</Text>
                </View>

                <View style={styles.vsCenter}>
                    <View style={styles.vsLine} />
                    <View style={styles.vsCircle}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>
                    <View style={styles.vsLine} />
                </View>

                <View style={styles.carSide}>
                    <View style={styles.imgWrapper}>
                        <Image source={{ uri: item.rightImage }} style={styles.carImage} resizeMode="cover" />
                    </View>
                    <Text style={styles.carName} numberOfLines={1}>{item.rightName}</Text>
                    <Text style={styles.carYear}>Vehicle B</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.footerLink}>View detailed comparison</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 16,
        width: '100%',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: "#F1F5F9",
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.primary,
    },
    viewsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewsText: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
    },
    compareBody: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    carSide: {
        flex: 1,
        alignItems: "center"
    },
    imgWrapper: {
        width: '100%',
        height: 80,
        borderRadius: 5,
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    carImage: {
        width: '100%',
        height: '100%',
    },
    carName: {
        fontSize: 12,
        fontWeight: "800",
        color: "#1E293B",
        textAlign: "center"
    },
    carYear: {
        fontSize: 10,
        color: "#94A3B8",
        fontWeight: '600',
        marginTop: 2
    },
    vsCenter: {
        width: 40,
        alignItems: "center",
        justifyContent: 'center',
    },
    vsLine: {
        width: 1,
        height: 15,
        backgroundColor: '#F1F5F9',
    },
    vsCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 4,
    },
    vsText: {
        color: "#94A3B8",
        fontSize: 9,
        fontWeight: "900"
    },
    cardFooter: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    footerLink: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    }
});

export default ComparisonCard;
