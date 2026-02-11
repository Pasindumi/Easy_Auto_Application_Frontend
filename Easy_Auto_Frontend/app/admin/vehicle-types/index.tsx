import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import { ENDPOINTS } from '@/constants/API';
import Header from '@/components/Header';

export default function VehicleTypesManagement() {
    const router = useRouter();
    const [types, setTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchTypes = async () => {
        try {
            const response = await fetch(ENDPOINTS.VEHICLE_CONFIG.TYPES);
            if (response.ok) {
                const data = await response.json();
                setTypes(data);
            } else {
                Alert.alert("Error", "Failed to fetch vehicle types.");
            }
        } catch (error) {
            console.error("Error fetching types:", error);
            Alert.alert("Error", "Network error while fetching types.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchTypes();
    };

    const handleDelete = async (id: string, name: string) => {
        Alert.alert(
            "Delete Vehicle Type",
            `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${ENDPOINTS.VEHICLE_CONFIG.TYPES}/${id}`, {
                                method: 'DELETE',
                            });

                            if (response.ok) {
                                Alert.alert("Success", "Vehicle type deleted successfully.");
                                fetchTypes(); // Refresh list
                            } else {
                                const errText = await response.text();
                                Alert.alert("Error", `Failed to delete: ${errText}`);
                            }
                        } catch (error) {
                            console.error("Delete error:", error);
                            Alert.alert("Error", "Network error while deleting.");
                        }
                    }
                }
            ]
        );
    };

    const handleAddType = async () => {
        if (!newTypeName.trim()) {
            Alert.alert("Validation", "Please enter a vehicle type name.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(ENDPOINTS.VEHICLE_CONFIG.TYPES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type_name: newTypeName }),
            });

            if (response.ok) {
                Alert.alert("Success", "Vehicle type added successfully.");
                setNewTypeName('');
                setIsAddModalVisible(false);
                fetchTypes();
            } else {
                const errData = await response.json();
                Alert.alert("Error", errData.message || "Failed to add vehicle type.");
            }
        } catch (error) {
            console.error("Add error:", error);
            Alert.alert("Error", "Network error while adding type.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.typeInfo}>
                <View style={styles.iconContainer}>
                    <Ionicons name="car-sport-outline" size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.typeName}>{item.type_name}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.type_name)}
            >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header title="Manage Vehicle Types" showBack={true} />

            <View style={styles.content}>
                <View style={styles.actionHeader}>
                    <Text style={styles.countText}>
                        {types.length} {types.length === 1 ? 'Type' : 'Types'} Found
                    </Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsAddModalVisible(true)}
                    >
                        <Ionicons name="add" size={20} color={COLORS.white} />
                        <Text style={styles.addButtonText}>Add New</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        data={types}
                        renderItem={renderItem}
                        keyExtractor={item => item.id?.toString() || Math.random().toString()}
                        contentContainerStyle={styles.listContent}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No vehicle types found.</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* Add Type Modal */}
            <Modal
                transparent={true}
                visible={isAddModalVisible}
                animationType="fade"
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Vehicle Type</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Type Name (e.g. Convertible)"
                            value={newTypeName}
                            onChangeText={setNewTypeName}
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalButtonCancel}
                                onPress={() => setIsAddModalVisible(false)}
                            >
                                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonSubmit}
                                onPress={handleAddType}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                ) : (
                                    <Text style={styles.modalButtonTextSubmit}>Add</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    actionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    countText: {
        fontSize: 14,
        color: COLORS.text.muted,
        fontWeight: '600',
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        gap: 6,
    },
    addButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    typeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    deleteButton: {
        padding: 10,
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: COLORS.text.muted,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.text.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: COLORS.text.primary,
        backgroundColor: '#F9FAFB',
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButtonCancel: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    modalButtonSubmit: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    modalButtonTextCancel: {
        color: COLORS.text.primary,
        fontWeight: '700',
        fontSize: 16,
    },
    modalButtonTextSubmit: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 16,
    },
});
