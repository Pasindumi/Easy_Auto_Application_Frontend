import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SimilarComparison } from '../../../types/compare-detail.types';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    comparisons: SimilarComparison[];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

const SimilarComparisonsSection: React.FC<Props> = ({ comparisons }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.similarTitle}>Similar Comparisons</Text>
                    <Text style={styles.similarSub}>Hand-picked vehicles you might explore</Text>
                </View>
                <TouchableOpacity style={styles.viewAll}>
                    <Text style={styles.viewAllText}>See All</Text>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
            
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={CARD_WIDTH + 20}
                decelerationRate="fast"
            >
                {comparisons.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.9}>
                        <View style={styles.imageSection}>
                            <View style={styles.carHalf}>
                                <Image source={{ uri: item.leftImage }} style={styles.carImg} />
                                <View style={styles.carLabelBg}>
                                    <Text style={styles.carLabel} numberOfLines={1}>{item.leftName}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.vsCircleContainer}>
                                <LinearGradient
                                    colors={['#1E293B', '#0F172A']}
                                    style={styles.vsCircle}
                                >
                                    <Text style={styles.vsText}>VS</Text>
                                </LinearGradient>
                            </View>

                            <View style={styles.carHalf}>
                                <Image source={{ uri: item.rightImage }} style={styles.carImg} />
                                <View style={styles.carLabelBg}>
                                    <Text style={styles.carLabel} numberOfLines={1}>{item.rightName}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <Text style={styles.comparisonType}>Direct Market Match</Text>
                            <View style={styles.footerRight}>
                                <Ionicons name="stats-chart" size={12} color="#94A3B8" />
                                <Text style={styles.matchText}>High Relevance</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    headerLeft: {
        flex: 1,
    },
    similarTitle: { 
        fontSize: 20, 
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 4,
    },
    similarSub: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    viewAll: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    },
    scrollContent: {
        paddingLeft: 24,
        paddingRight: 10,
        paddingBottom: 20,
    },
    card: { 
        width: CARD_WIDTH,
        backgroundColor: '#fff', 
        borderRadius: 28, 
        marginRight: 20,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    imageSection: {
        flexDirection: 'row',
        height: 140,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    carHalf: {
        flex: 1,
        position: 'relative',
    },
    carImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    carLabelBg: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backdropFilter: 'blur(10px)', // For web, but good practice
    },
    carLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1E293B',
        textAlign: 'center',
    },
    vsCircleContainer: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -18,
        marginTop: -18,
        zIndex: 10,
    },
    vsCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    vsText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 4,
    },
    comparisonType: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    matchText: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
    }
});

export default SimilarComparisonsSection;
