import { Comparison } from '@/types/compare.types';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';


interface ComparisonCardProps {
    item: Comparison;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ item }) => {
    return (
        <View style={styles.compareCard}>
            <View style={styles.side}>
                <Image source={item.left.img} style={styles.carImage} />
                <Text style={styles.carName}>{item.left.name}</Text>
                {item.left.year && <Text style={styles.carYear}>{item.left.year}</Text>}
            </View>

            <View style={styles.vsColumn}>
                <View style={styles.vsCircle}>
                    <Text style={styles.vsText}>vs</Text>
                </View>
            </View>

            <View style={styles.side}>
                <Image source={item.right.img} style={styles.carImage} />
                <Text style={styles.carName}>{item.right.name}</Text>
                {item.right.year && <Text style={styles.carYear}>{item.right.year}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    compareCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        marginHorizontal: 16,
        marginTop: 16,
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        borderWidth: 0.5,
        borderColor: "rgba(35,92,248,0.3)",
    },
    side: { flex: 1, alignItems: "center" },
    carImage: { width: 120, height: 70, borderRadius: 8, marginBottom: 8 },
    carName: { fontWeight: "700", color: "#111", textAlign: "center" },
    carYear: { color: "#235CF8", marginTop: 4 },
    vsColumn: { width: 40, alignItems: "center" },
    vsCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E6E8EE",
        alignItems: "center",
        justifyContent: "center",
    },
    vsText: { color: "#235CF8", fontWeight: "700" },
});

export default ComparisonCard;
