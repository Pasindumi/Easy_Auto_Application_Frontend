import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    FlatList
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '@/constants/Colors';
import { TESTIMONIALS } from '@/constants/dummydata/homedummydata';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

export default function TestimonialsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const renderHeader = () => (
        <LinearGradient
            colors={[COLORS.primary, COLORS.primary]}
            style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
            <TouchableOpacity 
                style={styles.backBtn} 
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.back();
                }}
            >
                <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleRow}>
                <Text style={styles.headerTitle}>User Stories</Text>
                <Text style={styles.headerSub}>What our community says about EasyAuto</Text>
            </View>
        </LinearGradient>
    );

    const renderTestimonial = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.userInfo}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} contentFit="cover" transition={200} />
                    <View>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userRole}>{item.role || 'Car Owner'}</Text>
                    </View>
                </View>
                <View style={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons key={s} name="star" size={12} color="#FCD34D" style={{ marginLeft: 2 }} />
                    ))}
                </View>
            </View>
            
            <View style={styles.quoteBox}>
                <Ionicons name="chatbox" size={20} color="#E2E8F0" style={styles.quoteIcon} />
                <Text style={styles.comment}>{item.comment}</Text>
            </View>
            
            <View style={styles.cardFooter}>
                <Text style={styles.date}>Verified Transaction — 2 days ago</Text>
                <TouchableOpacity style={styles.helpfulBtn}>
                    <Ionicons name="thumbs-up-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.helpfulText}>Helpful</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />
            
            {renderHeader()}
            
            <FlatList
                data={TESTIMONIALS}
                renderItem={renderTestimonial}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View style={styles.introBox}>
                        <View style={styles.statRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>4.9/5</Text>
                                <Text style={styles.statLab}>Avg Rating</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>10k+</Text>
                                <Text style={styles.statLab}>Happy Users</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statVal}>98%</Text>
                                <Text style={styles.statLab}>Success Rate</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    headerTitleRow: {
        marginTop: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -0.8,
    },
    headerSub: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
        fontWeight: '600',
    },
    introBox: {
        padding: 20,
        marginTop: -20,
        zIndex: 10,
    },
    statRow: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statVal: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
    },
    statLab: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#F1F5F9',
    },
    list: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: 'rgba(0,0,0,0.02)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        marginRight: 12,
        backgroundColor: '#F1F5F9',
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    userRole: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 1,
    },
    ratingRow: {
        flexDirection: 'row',
    },
    quoteBox: {
        position: 'relative',
        paddingLeft: 10,
    },
    quoteIcon: {
        position: 'absolute',
        top: -10,
        left: -5,
        opacity: 0.5,
    },
    comment: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F8FAFC',
    },
    date: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
    },
    helpfulBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    helpfulText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
    },
});
