import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';

interface RentalDocumentSectionProps {
    documents: {
        idType: string;
        idFrontUrl?: string;
        idBackUrl?: string;
        ownershipUrl?: string;
    };
    pickDocument: (type: 'idFront' | 'idBack' | 'ownership') => void;
    removeDocument: (type: 'idFront' | 'idBack' | 'ownership') => void;
}

const RentalDocumentSection: React.FC<RentalDocumentSectionProps> = ({ documents, pickDocument, removeDocument }) => {
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
                <Text style={styles.sectionTitle}>Verification Documents</Text>
            </View>
            <Text style={styles.infoText}>
                Upload clear photos of your documents to get a "Verified" badge. This increases trust and ad visibility.
            </Text>

            <View style={styles.docGrid}>
                {/* ID Front */}
                <View style={styles.docItem}>
                    <Text style={styles.docLabel}>NIC / License (Front)</Text>
                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={() => pickDocument('idFront')}
                    >
                        {documents.idFrontUrl ? (
                            <View style={styles.previewContainer}>
                                <Image source={{ uri: documents.idFrontUrl }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={() => removeDocument('idFront')}
                                >
                                    <Ionicons name="close-circle" size={24} color={COLORS.status?.danger || '#ff4444'} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="camera-outline" size={30} color="#999" />
                                <Text style={styles.placeholderText}>Upload Front</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* ID Back */}
                <View style={styles.docItem}>
                    <Text style={styles.docLabel}>NIC / License (Back)</Text>
                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={() => pickDocument('idBack')}
                    >
                        {documents.idBackUrl ? (
                            <View style={styles.previewContainer}>
                                <Image source={{ uri: documents.idBackUrl }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={() => removeDocument('idBack')}
                                >
                                    <Ionicons name="close-circle" size={24} color={COLORS.status?.danger || '#ff4444'} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="camera-outline" size={30} color="#999" />
                                <Text style={styles.placeholderText}>Upload Back</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Vehicle Log Book */}
                <View style={styles.docItem}>
                    <Text style={styles.docLabel}>Vehicle Log Book (Copy)</Text>
                    <TouchableOpacity
                        style={styles.uploadBox}
                        onPress={() => pickDocument('ownership')}
                    >
                        {documents.ownershipUrl ? (
                            <View style={styles.previewContainer}>
                                <Image source={{ uri: documents.ownershipUrl }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={() => removeDocument('ownership')}
                                >
                                    <Ionicons name="close-circle" size={24} color={COLORS.status?.danger || '#ff4444'} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.placeholder}>
                                <Ionicons name="document-text-outline" size={30} color="#999" />
                                <Text style={styles.placeholderText}>Upload Copy</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: COLORS.white,
        padding: 20,
        marginVertical: 10,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 20,
        lineHeight: 18,
    },
    docGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    docItem: {
        width: '48%',
        marginBottom: 20,
    },
    docLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
    },
    uploadBox: {
        width: '100%',
        height: 110,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 12,
        backgroundColor: '#fcfcfc',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 11,
        color: '#999',
        marginTop: 5,
    },
    previewContainer: {
        width: '100%',
        height: '100%',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 12,
    }
});

export default RentalDocumentSection;
