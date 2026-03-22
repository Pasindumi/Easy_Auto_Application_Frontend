import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const SubscriptionsHeader: React.FC = () => {
    return (
        <View style={styles.headerWrap}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Ionicons name="people-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
                    <Text style={styles.headerTitle}>My Subscribers</Text>
                </View>
                <Image
                    source={require("@/assets/logoHome.png")}
                    style={{ width: 85, height: 22 }}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrap: { backgroundColor: '#E5E3E3' },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#D1D5DB'
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});

export default SubscriptionsHeader;
