import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SimilarComparison } from '../../../types/compare-detail.types';

interface Props {
    comparisons: SimilarComparison[];
}

const SimilarComparisonsSection: React.FC<Props> = ({ comparisons }) => {
    return (
        <View>
            <Text style={styles.similarTitle}>SIMILAR CAR COMPARISONS</Text>
            <View style={styles.similarGrid}>
                {comparisons.map((item) => (
                    <View key={item.id} style={styles.similarCard}>
                        <Image source={{ uri: item.leftImage }} style={styles.similarImage} />
                        <View style={styles.vsSmall}>
                            <Text style={styles.vsTextSmall}>VS</Text>
                        </View>
                        <Image source={{ uri: item.rightImage }} style={styles.similarImage} />
                        <View style={styles.similarNames}>
                            <Text style={styles.similarName}>{item.leftName}</Text>
                            <Text style={styles.similarName}>{item.rightName}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    similarTitle: { textAlign: 'center', fontSize: 12, marginVertical: 10, fontWeight: '700' },
    similarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10 },
    similarCard: { width: '46%', backgroundColor: '#fff', borderRadius: 14, padding: 10, alignItems: 'center', marginBottom: 14 },
    similarImage: { width: '100%', height: 60, resizeMode: 'cover', borderRadius: 10 },
    vsSmall: { marginVertical: 5, backgroundColor: '#000', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
    vsTextSmall: { color: '#fff', fontSize: 10 },
    similarNames: { marginTop: 5, alignItems: 'center' },
    similarName: { fontSize: 11, textAlign: 'center', fontWeight: '600' },
});

export default SimilarComparisonsSection;
