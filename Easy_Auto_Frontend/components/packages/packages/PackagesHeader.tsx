import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

const HEADER_HEIGHT = 140;

const PackagesHeader: React.FC = () => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => router.replace("./ads/my-ads")} style={{ marginRight: 12 }}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>PACKAGES</Text>
            </View>
            <Image
                source={require("@/assets/logoHome.png")}
                style={{ width: 85, height: 22 }}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        backgroundColor: '#235CF8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.6,
    },
});

export default PackagesHeader;
