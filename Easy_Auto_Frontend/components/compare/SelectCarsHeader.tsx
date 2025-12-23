import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SelectCarsHeader: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>SELECT CARS</Text>

            <View style={styles.selectRow}>
                <View style={styles.selectCard}>
                    <View style={styles.iconBox}>
                        <Text style={styles.iconCar}>＋</Text>
                    </View>
                    <Text style={styles.selectText}>SELECT CAR</Text>
                </View>

                <View style={styles.selectDivider}>
                    <View style={styles.vsSmallCircle}>
                        <Text style={styles.vsSmallText}>vs</Text>
                    </View>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.selectCard}>
                    <View style={styles.iconBox}>
                        <Text style={styles.iconCar}>＋</Text>
                    </View>
                    <Text style={styles.selectText}>SELECT CAR</Text>
                </View>
            </View>

            <View style={styles.actionsRow}>
                <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>＋ Add</Text>
                </View>
                <View style={styles.compareButton}>
                    <Text style={styles.compareButtonText}>Compare</Text>
                </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 37 }]}>
                POPULAR CAR COMPARISONS
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, marginTop: 24 },
    sectionTitle: { fontSize: 12, color: "#333", fontWeight: "700", marginBottom: 12 },
    selectRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    selectCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        borderWidth: 0.5,
        borderColor: "rgba(35,92,248,0.3)",
    },
    iconBox: {
        width: 80,
        height: 48,
        backgroundColor: "#F4F6FA",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    iconCar: { fontSize: 28, color: "#2F6BFF", fontWeight: "700" },
    selectText: { fontSize: 14, fontWeight: "700", color: "#444" },
    selectDivider: { width: 58, alignItems: "center", marginHorizontal: 8 },
    vsSmallCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E6E8EE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
    },
    vsSmallText: { color: "#235CF8", fontWeight: "700" },
    dividerLine: { width: 1, flex: 1, backgroundColor: "#E6E8EE" },
    actionsRow: { flexDirection: "row", marginTop: 16, justifyContent: "center" },
    addButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#2F6BFF", borderRadius: 8, marginRight: 12 },
    addButtonText: { color: "#fff", fontWeight: "700" },
    compareButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: "#2F6BFF" },
    compareButtonText: { color: "#235CF8", fontWeight: "700" },
});

export default SelectCarsHeader;
