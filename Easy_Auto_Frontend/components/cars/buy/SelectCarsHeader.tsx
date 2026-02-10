import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

interface SelectCarsHeaderProps {
    selectedCar1: any;
    selectedCar2: any;
    onSelectCar1: () => void;
    onSelectCar2: () => void;
    onCompare: () => void;
}

const SelectCarsHeader: React.FC<SelectCarsHeaderProps> = ({ selectedCar1, selectedCar2, onSelectCar1, onSelectCar2, onCompare }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>SELECT CARS</Text>

            <View style={styles.selectRow}>
                <TouchableOpacity style={styles.selectCard} onPress={onSelectCar1}>
                    {selectedCar1 ? (
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={{ uri: selectedCar1.AdImage?.[0]?.image_url }}
                                style={styles.selectedImage}
                            />
                            <Text style={styles.selectedText} numberOfLines={1}>{selectedCar1.title}</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.iconBox}>
                                <Text style={styles.iconCar}>＋</Text>
                            </View>
                            <Text style={styles.selectText}>SELECT CAR</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.selectDivider}>
                    <View style={styles.vsSmallCircle}>
                        <Text style={styles.vsSmallText}>vs</Text>
                    </View>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.selectCard} onPress={onSelectCar2}>
                    {selectedCar2 ? (
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={{ uri: selectedCar2.AdImage?.[0]?.image_url }}
                                style={styles.selectedImage}
                            />
                            <Text style={styles.selectedText} numberOfLines={1}>{selectedCar2.title}</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.iconBox}>
                                <Text style={styles.iconCar}>＋</Text>
                            </View>
                            <Text style={styles.selectText}>SELECT CAR</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.compareButton} onPress={onCompare}>
                    <Text style={styles.compareButtonText}>Compare Now</Text>
                </TouchableOpacity>
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
        height: 140, // Fixed height for consistency
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
    selectedImage: { width: 100, height: 60, borderRadius: 6, marginBottom: 8 },
    selectedText: { fontSize: 12, fontWeight: "700", color: "#333", textAlign: 'center' },
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
    compareButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        backgroundColor: "#2F6BFF",
        shadowColor: "#235CF8",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5
    },
    compareButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

export default SelectCarsHeader;
