import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import COLORS from '@/constants/Colors';

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
    container: { paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
    sectionTitle: {
        fontSize: 11,
        color: COLORS.text.muted,
        fontWeight: "800",
        marginBottom: 16,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    selectRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    selectCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.shadowPremium || '#235CF8',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1.5,
        borderColor: "rgba(35, 92, 248, 0.05)",
        height: 150,
    },
    iconBox: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(35, 92, 248, 0.1)',
    },
    iconCar: { fontSize: 24, color: COLORS.primary, fontWeight: "700" },
    selectText: { fontSize: 13, fontWeight: "800", color: COLORS.text.primary, letterSpacing: -0.2 },
    selectedImage: { width: '100%', height: 75, borderRadius: 12, marginBottom: 10 },
    selectedText: { fontSize: 12, fontWeight: "700", color: COLORS.text.primary, textAlign: 'center' },
    selectDivider: { width: 50, alignItems: "center", marginHorizontal: 4 },
    vsSmallCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    vsSmallText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },
    dividerLine: { width: 2, flex: 1, backgroundColor: "#F3F4F6", borderRadius: 1 },
    actionsRow: { flexDirection: "row", marginTop: 24, justifyContent: "center" },
    compareButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.25,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
        alignItems: 'center',
    },
    compareButtonText: { color: "#fff", fontWeight: "800", fontSize: 16, letterSpacing: -0.3 },
});

export default SelectCarsHeader;
