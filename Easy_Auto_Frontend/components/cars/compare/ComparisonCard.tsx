import { Comparison } from '@/types/compare.types';
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface ComparisonCardProps {
    item: Comparison;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ item }) => {
    return (
        <TouchableOpacity 
            style={styles.container}
            activeOpacity={0.9}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={styles.badgeText}>TRENDING</Text>
                </View>
                <View style={styles.viewsContainer}>
                    <Ionicons name="eye-outline" size={12} color="#94A3B8" />
                    <Text style={styles.viewsText}>2.4k views</Text>
                </View>
            </View>

            <View style={styles.compareBody}>
                <View style={styles.carSide}>
                    <View style={styles.imgWrapper}>
                        <Image source={item.left.img} style={styles.carImage} resizeMode="cover" />
                    </View>
                    <Text style={styles.carName} numberOfLines={1}>{item.left.name}</Text>
                    <Text style={styles.carYear}>{item.left.year || '2023'}</Text>
                </View>

                <View style={styles.vsCenter}>
                    <LinearGradient
                        colors={['#F1F5F9', '#F8FAFC']}
                        style={styles.vsLine}
                    />
                    <View style={styles.vsCircle}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>
                    <LinearGradient
                        colors={['#F8FAFC', '#F1F5F9']}
                        style={styles.vsLine}
                    />
                </View>

                <View style={styles.carSide}>
                    <View style={styles.imgWrapper}>
                        <Image source={item.right.img} style={styles.carImage} resizeMode="cover" />
                    </View>
                    <Text style={styles.carName} numberOfLines={1}>{item.right.name}</Text>
                    <Text style={styles.carYear}>{item.right.year || '2023'}</Text>
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
        borderRadius: 24,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F1F5F9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
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
        borderRadius: 6,
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
    },
    carSide: { 
        flex: 1, 
        alignItems: "center" 
    },
    imgWrapper: {
        width: '100%',
        height: 70,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    carImage: { 
        width: '100%', 
        height: '100%',
    },
    carName: { 
        fontSize: 13,
        fontWeight: "800", 
        color: "#1E293B", 
        textAlign: "center" 
    },
    carYear: { 
        fontSize: 11,
        color: "#94A3B8", 
        fontWeight: '600',
        marginTop: 2 
    },
    vsCenter: { 
        width: 50, 
        alignItems: "center",
        justifyContent: 'center',
    },
    vsLine: {
        width: 1,
        height: 20,
    },
    vsCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#F1F5F9",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 4,
    },
    vsText: { 
        color: "#CBD5E1", 
        fontSize: 10,
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
